import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FileUpload } from "@/components/ui/file-upload";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { formatScore, getScoreColor, getScoreDescription } from "@/lib/ats-scoring";
import { analyzeResumeFree, getFreeAttemptsRemaining } from "@/lib/free-tier-api";
import { Loader2, File, CheckCircle, AlertTriangle, Info } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { RateLimitInfo } from "@/types/api";

export default function TryFree() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [resumeContent, setResumeContent] = useState<string>("");
  const [rateLimitInfo, setRateLimitInfo] = useState<RateLimitInfo | null>(null);
  const [result, setResult] = useState<{
    score: number;
    keywords: string[];
    suggestions: string[];
    improvements: { [key: string]: number };
  } | null>(null);

  useEffect(() => {
    // Fetch remaining attempts when component mounts
    const fetchRateLimit = async () => {
      try {
        const info = await getFreeAttemptsRemaining();
        setRateLimitInfo(info);
      } catch (error) {
        console.error("Error fetching rate limit info:", error);
      }
    };
    fetchRateLimit();
  }, []);

  const handleFileRead = async (file: File) => {
    try {
      const text = await file.text();
      setResumeContent(text);
    } catch (error) {
      console.error("Error reading file:", error);
      toast({
        title: "Error reading file",
        description: "Failed to read the resume file. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (resumeFile) {
      handleFileRead(resumeFile);
    }
  }, [resumeFile]);

  const handleAnalyzeResume = async () => {
    if (!resumeContent) {
      toast({
        title: "No resume content",
        description: "Please upload your resume first",
        variant: "destructive",
      });
      return;
    }

    if (!jobDescription) {
      toast({
        title: "Missing job description",
        description: "Please enter a job description for analysis",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setResult(null);

    try {
      const analysisResult = await analyzeResumeFree(resumeContent);
      setResult(analysisResult);
      
      // Refresh rate limit info after analysis
      const updatedRateLimit = await getFreeAttemptsRemaining();
      setRateLimitInfo(updatedRateLimit);

      toast({
        title: "Analysis complete!",
        description: `Your resume received an ATS score of ${analysisResult.score}%`,
      });
    } catch (error) {
      console.error("Error analyzing resume:", error);
      const errorMessage = error instanceof Error ? error.message : "There was an error analyzing your resume";
      toast({
        title: "Analysis failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCreateAccount = () => {
    navigate("/auth");
  };

  const remainingAttemptsSection = rateLimitInfo && (
    <div className="mb-8 text-center">
      <div className="inline-block bg-blue-50 rounded-lg px-6 py-4">
        <h3 className="text-lg font-semibold mb-2">Free Tier Usage</h3>
        <p className="text-gray-600">
          You have {rateLimitInfo.attempts_remaining} out of {rateLimitInfo.max_attempts} free attempts remaining
          {rateLimitInfo.reset_time && rateLimitInfo.reset_time > 0 && (
            <span> (resets in {Math.ceil(rateLimitInfo.reset_time / 3600)} hours)</span>
          )}
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-3xl font-bold mb-4">Try ResumeAI For Free</h1>
            <p className="text-xl text-gray-600">
              Upload your resume and a job description to get a free ATS compatibility analysis
            </p>
          </div>
          
          {remainingAttemptsSection}
          
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Upload your resume</CardTitle>
                    <CardDescription>
                      We support PDF and DOCX formats up to 5MB
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FileUpload
                      onFileSelected={setResumeFile}
                      supportedFormats={[".pdf", ".docx"]}
                      maxSizeMB={5}
                    />
                    
                    {resumeFile && (
                      <div className="mt-4 flex items-center p-3 bg-blue-50 rounded-lg">
                        <File className="h-5 w-5 text-blue-500 mr-2" />
                        <div className="text-sm">
                          <p className="font-medium">{resumeFile.name}</p>
                          <p className="text-gray-500">{(resumeFile.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Enter job description</CardTitle>
                    <CardDescription>
                      Paste the full job description for best results
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      placeholder="Paste job description here..."
                      className="min-h-[200px]"
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                    />
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full"
                      disabled={isAnalyzing || !resumeFile || !jobDescription}
                      onClick={handleAnalyzeResume}
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        "Analyze My Resume"
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </div>
              
              <div>
                {isAnalyzing ? (
                  <Card className="h-full flex flex-col justify-center items-center p-8 text-center">
                    <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Analyzing Your Resume</h3>
                    <p className="text-gray-600 mb-4">
                      We're comparing your resume with the job description to generate insights.
                    </p>
                    <Progress value={45} className="w-full" />
                  </Card>
                ) : result ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>Resume Analysis Results</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="text-center p-4">
                        <div className="inline-flex items-center justify-center p-4 bg-gray-50 rounded-full mb-2">
                          <div className="text-4xl font-bold" style={{ color: getScoreColor(result.score).replace('text-', '') }}>
                            {formatScore(result.score)}
                          </div>
                        </div>
                        <h3 className="text-xl font-semibold mb-1">ATS Compatibility Score</h3>
                        <p className="text-gray-600">{getScoreDescription(result.score)}</p>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-lg mb-3">Key Findings</h3>
                        <div className="space-y-3">
                          <div className="flex items-start bg-green-50 p-3 rounded-lg">
                            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                            <div>
                              <span className="font-medium">Keywords Match</span>
                              <p className="text-sm text-gray-600">
                                Your resume matches {result.keywords.length} out of {result.keywords.length} important keywords.
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-start bg-amber-50 p-3 rounded-lg">
                            <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 mr-2 flex-shrink-0" />
                            <div>
                              <span className="font-medium">Missing Keywords</span>
                              <p className="text-sm text-gray-600">
                                Consider adding these keywords: {result.keywords.slice(0, 3).join(", ")}
                                {result.keywords.length > 3 ? " and more..." : ""}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-start bg-blue-50 p-3 rounded-lg">
                            <Info className="h-5 w-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                            <div>
                              <span className="font-medium">Suggestions</span>
                              <p className="text-sm text-gray-600">
                                We've found {result.suggestions.length} improvement suggestions for your resume.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="border-t pt-4">
                        <h3 className="font-semibold mb-2">Ready to unlock full insights?</h3>
                        <p className="text-sm text-gray-600 mb-4">
                          Create an account to view detailed keyword analysis, ATS-friendly formatting suggestions, and access our premium features.
                        </p>
                        <Button className="w-full" onClick={handleCreateAccount}>
                          Create Free Account
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="h-full flex flex-col justify-center items-center p-8 text-center bg-gray-50 border-dashed">
                    <div className="rounded-full bg-blue-100 p-3 mb-4">
                      <File className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Your Analysis Will Appear Here</h3>
                    <p className="text-gray-600 mb-6">
                      Upload your resume and paste a job description, then click "Analyze My Resume" to get started.
                    </p>
                    <div className="space-y-4 w-full max-w-md">
                      <div className="flex items-start">
                        <div className="bg-green-100 rounded-full p-1 mr-3">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </div>
                        <p className="text-sm text-gray-600 text-left">ATS compatibility score</p>
                      </div>
                      <div className="flex items-start">
                        <div className="bg-green-100 rounded-full p-1 mr-3">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </div>
                        <p className="text-sm text-gray-600 text-left">Keyword analysis and suggestions</p>
                      </div>
                      <div className="flex items-start">
                        <div className="bg-green-100 rounded-full p-1 mr-3">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </div>
                        <p className="text-sm text-gray-600 text-left">Quick improvement recommendations</p>
                      </div>
                    </div>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}