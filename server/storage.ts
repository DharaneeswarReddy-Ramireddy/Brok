import { 
  users, type User, type InsertUser,
  resumes, type Resume, type InsertResume,
  atsScores, type AtsScore, type InsertAtsScore
} from "@shared/schema";

import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getResume(id: number): Promise<Resume | undefined>;
  getResumesByUserId(userId: number): Promise<Resume[]>;
  createResume(resume: InsertResume): Promise<Resume>;
  deleteResume(id: number): Promise<boolean>;
  
  getAtsScore(id: number): Promise<AtsScore | undefined>;
  getAtsScoresByResumeId(resumeId: number): Promise<AtsScore[]>;
  createAtsScore(atsScore: InsertAtsScore): Promise<AtsScore>;

  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private resumes: Map<number, Resume>;
  private atsScores: Map<number, AtsScore>;
  private currentUserId: number;
  private currentResumeId: number;
  private currentAtsScoreId: number;

  sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.resumes = new Map();
    this.atsScores = new Map();
    this.currentUserId = 1;
    this.currentResumeId = 1;
    this.currentAtsScoreId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Resume methods
  async getResume(id: number): Promise<Resume | undefined> {
    return this.resumes.get(id);
  }

  async getResumesByUserId(userId: number): Promise<Resume[]> {
    return Array.from(this.resumes.values()).filter(
      (resume) => resume.userId === userId,
    );
  }

  async createResume(insertResume: InsertResume): Promise<Resume> {
    const id = this.currentResumeId++;
    // Ensure userId is either a number or null, not undefined
    const userId = insertResume.userId ?? null;
    const resume: Resume = { ...insertResume, id, userId };
    this.resumes.set(id, resume);
    return resume;
  }

  async deleteResume(id: number): Promise<boolean> {
    return this.resumes.delete(id);
  }

  // ATS Score methods
  async getAtsScore(id: number): Promise<AtsScore | undefined> {
    return this.atsScores.get(id);
  }

  async getAtsScoresByResumeId(resumeId: number): Promise<AtsScore[]> {
    return Array.from(this.atsScores.values()).filter(
      (score) => score.resumeId === resumeId,
    );
  }

  async createAtsScore(insertAtsScore: InsertAtsScore): Promise<AtsScore> {
    const id = this.currentAtsScoreId++;
    // Ensure resumeId is either a number or null, not undefined
    const resumeId = insertAtsScore.resumeId ?? null;
    const atsScore: AtsScore = { ...insertAtsScore, id, resumeId };
    this.atsScores.set(id, atsScore);
    return atsScore;
  }
}

export const storage = new MemStorage();
