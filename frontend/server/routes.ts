import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import { z } from "zod";
import { 
  insertResumeSchema, 
  insertAtsScoreSchema 
} from "@shared/schema";
import { setupAuth } from "./auth";
import { analyzeResume } from "./utils/resume-analyzer";

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (_req, file, cb) => {
    // Only accept PDFs and Word documents
    if (file.mimetype === "application/pdf" || 
        file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF and DOCX files are allowed"));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);
  
  // health check endpoint
  app.get("/api/health", (_req: Request, res: Response) => {
    res.json({ status: "ok" });
  });

  // Resume upload endpoint
  app.post("/api/resume/upload", upload.single("resume"), async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No resume file provided" });
      }

      // Extract file content (normally we would parse PDF/DOCX here)
      // For demo purposes, we're storing the raw buffer as a string
      const fileContent = req.file.buffer.toString("base64");
      
      const resume = await storage.createResume({
        userId: 1, // In a real app we would get this from authentication
        name: req.body.name || "Untitled Resume",
        content: fileContent,
        fileName: req.file.originalname,
        fileType: req.file.mimetype,
        createdAt: new Date().toISOString(),
      });

      res.status(201).json({ 
        id: resume.id,
        name: resume.name,
        fileName: resume.fileName,
        fileType: resume.fileType,
        createdAt: resume.createdAt
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to upload resume" });
    }
  });

  // ATS Score calculation endpoint
  app.post("/api/resume/analyze", async (req: Request, res: Response) => {
    try {
      // Validate request
      const schema = z.object({
        resumeId: z.number(),
        jobDescription: z.string().min(1)
      });
      
      const result = schema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid request", details: result.error });
      }
      
      const { resumeId, jobDescription } = result.data;
      
      // Get resume from storage
      const resume = await storage.getResume(resumeId);
      if (!resume) {
        return res.status(404).json({ error: "Resume not found" });
      }
      
      // Analyze resume against job description
      const analysis = analyzeResume(resume.content, jobDescription);
      
      // Store the ATS score
      const atsScore = await storage.createAtsScore({
        resumeId,
        jobDescription,
        score: analysis.score,
        keywords: analysis.keywords,
        suggestions: analysis.suggestions,
        createdAt: new Date().toISOString()
      });
      
      res.json({
        id: atsScore.id,
        score: atsScore.score,
        keywords: atsScore.keywords,
        suggestions: atsScore.suggestions
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to analyze resume" });
    }
  });

  // Get all resumes
  app.get("/api/resumes", async (_req: Request, res: Response) => {
    try {
      // In a real app, we would filter by the authenticated user's ID
      const resumes = await storage.getResumesByUserId(1);
      res.json(resumes.map(resume => ({
        id: resume.id,
        name: resume.name,
        fileName: resume.fileName,
        fileType: resume.fileType,
        createdAt: resume.createdAt
      })));
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch resumes" });
    }
  });

  // Get ATS scores for a resume
  app.get("/api/resume/:id/scores", async (req: Request, res: Response) => {
    try {
      const resumeId = parseInt(req.params.id);
      if (isNaN(resumeId)) {
        return res.status(400).json({ error: "Invalid resume ID" });
      }
      
      const scores = await storage.getAtsScoresByResumeId(resumeId);
      res.json(scores);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch ATS scores" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

/**
 * Utility function to analyze a resume against a job description.
 * This is a simplified implementation for demonstration purposes.
 */
const analyzeResume = (resumeContent: string, jobDescription: string) => {
  // Decode the base64 resume content
  let decodedContent = "";
  try {
    decodedContent = Buffer.from(resumeContent, "base64").toString();
  } catch (e) {
    decodedContent = resumeContent;
  }
  
  // Extract keywords from job description (simple split by spaces and filter)
  const keywords = jobDescription
    .toLowerCase()
    .split(/\s+/)
    .filter(word => word.length > 3)
    .filter((word, index, self) => self.indexOf(word) === index)
    .slice(0, 20); // Take top 20 keywords
  
  // Count matches in resume content
  const keywordMatches = keywords.map(keyword => {
    const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
    const matches = (decodedContent.match(regex) || []).length;
    return {
      keyword,
      matches,
      found: matches > 0
    };
  });
  
  // Calculate score (0-100)
  const matchedKeywords = keywordMatches.filter(k => k.found).length;
  const score = Math.round((matchedKeywords / keywords.length) * 100);
  
  // Generate suggestions
  const suggestions = [
    {
      category: "Missing Keywords",
      items: keywordMatches
        .filter(k => !k.found)
        .map(k => k.keyword)
        .slice(0, 5)
    },
    {
      category: "Format Improvement",
      items: [
        "Use standard section headings like 'Experience', 'Education', and 'Skills'",
        "Avoid tables and complex formatting that ATS may struggle with",
        "Use a clean, single-column layout for better parsing"
      ]
    },
    {
      category: "Content Recommendations",
      items: [
        "Quantify achievements with specific metrics and numbers",
        "Focus on results and impact rather than just responsibilities",
        "Tailor your skills section to match job requirements"
      ]
    }
  ];
  
  return {
    score,
    keywords: keywordMatches,
    suggestions
  };
};
