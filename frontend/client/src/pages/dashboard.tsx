import { useAuth } from "@/hooks/use-auth";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUpload } from "@/components/ui/file-upload";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { submitForATSScoring } from "@/lib/ats-scoring";
import { Loader2, Plus, File, BarChart, Edit, Clock, AlertTriangle } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadedResumeId, setUploadedResumeId] = useState<number | null>(null);
  
  // Mock data for resume history
  const recentResumes = [
    { id: 1, name: "Software Developer Resume", date: "2023-04-25", score: 87 },
    { id: 2, name: "Marketing Manager Resume", date: "2023-04-20", score: 72 },
    { id: 3, name: "UX Designer Resume", date: "2023-04-15", score: 91 },
  ];

  const handleAnalyzeResume = async () => {
    if (!resumeFile) {
      toast({
        title: "No resume selected",
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

    try {
      // First upload the resume if not already uploaded
      let resumeId = uploadedResumeId;
      if (!resumeId) {
        const formData = new FormData();
        formData.append("resume", resumeFile);
        formData.append("name", resumeFile.name);

        const response = await fetch("/api/resume/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Failed to upload resume");
        }

        const data = await response.json();
        resumeId = data.id;
        setUploadedResumeId(resumeId);
      }

      // Then analyze the resume
      const result = await submitForATSScoring(resumeId, jobDescription);

      // Show result
      toast({
        title: "Analysis complete!",
        description: `Your resume received an ATS score of ${result.score}%`,
      });
      
    } catch (error) {
      console.error("Error analyzing resume:", error);
      toast({
        title: "Analysis failed",
        description: "There was an error analyzing your resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Welcome back, {user?.name || "User"}!</h1>
          <p className="text-gray-600">Manage your resumes and optimize them for job applications</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Tabs defaultValue="analyze" className="w-full">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="analyze">Analyze Resume</TabsTrigger>
                <TabsTrigger value="history">Resume History</TabsTrigger>
                <TabsTrigger value="templates">Templates</TabsTrigger>
              </TabsList>
              
              <TabsContent value="analyze">
                <Card>
                  <CardHeader>
                    <CardTitle>Analyze Your Resume</CardTitle>
                    <CardDescription>
                      Upload your resume and a job description to get an ATS compatibility score
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Upload Your Resume</label>
                      <FileUpload 
                        onFileSelected={setResumeFile}
                        supportedFormats={[".pdf", ".docx"]}
                        maxSizeMB={5}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="job-description" className="block text-sm font-medium mb-2">
                        Job Description
                      </label>
                      <Textarea
                        id="job-description"
                        rows={6}
                        placeholder="Paste the job description here for best results..."
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        className="w-full"
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full"
                      disabled={isAnalyzing}
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
              </TabsContent>
              
              <TabsContent value="history">
                <Card>
                  <CardHeader>
                    <CardTitle>Resume History</CardTitle>
                    <CardDescription>
                      View and manage your previously analyzed resumes
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="divide-y">
                      {recentResumes.map((resume) => (
                        <div key={resume.id} className="py-4 flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="bg-blue-100 p-2 rounded mr-4">
                              <File className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <h4 className="font-medium">{resume.name}</h4>
                              <div className="flex items-center text-sm text-gray-500">
                                <Clock className="h-3 w-3 mr-1" />
                                <span>{resume.date}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center">
                              <BarChart className="h-4 w-4 mr-1 text-blue-600" />
                              <span className="font-medium">{resume.score}%</span>
                            </div>
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Upload New Resume
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="templates">
                <Card>
                  <CardHeader>
                    <CardTitle>Resume Templates</CardTitle>
                    <CardDescription>
                      Choose from ATS-optimized templates for different industries
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      {["Professional", "Creative", "Executive", "Technical", "Modern", "Academic"].map((template) => (
                        <div key={template} className="border rounded-lg p-4 hover:border-primary cursor-pointer transition">
                          <div className="h-40 bg-gray-100 rounded mb-4 flex items-center justify-center">
                            <File className="h-12 w-12 text-gray-400" />
                          </div>
                          <h4 className="font-medium">{template} Template</h4>
                          <p className="text-sm text-gray-500">Optimized for {template.toLowerCase()} roles</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Account Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Current Plan</h4>
                  <p className="font-medium">Free Plan</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Resumes Analyzed</h4>
                  <p className="font-medium">3 / 5 this month</p>
                </div>
                <div className="flex items-center space-x-3 text-amber-600 bg-amber-50 p-3 rounded-lg">
                  <AlertTriangle className="h-5 w-5" />
                  <p className="text-sm">
                    Upgrade to Premium for unlimited resume analyses
                  </p>
                </div>
                <Button className="w-full">Upgrade to Premium</Button>
              </CardContent>
            </Card>
            
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="bg-green-100 p-1.5 rounded-full mr-3">
                      <BarChart className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm">Resume analyzed</p>
                      <p className="text-xs text-gray-500">Today at 10:30 AM</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-blue-100 p-1.5 rounded-full mr-3">
                      <File className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm">New resume uploaded</p>
                      <p className="text-xs text-gray-500">Today at 10:15 AM</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-purple-100 p-1.5 rounded-full mr-3">
                      <Edit className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm">Profile updated</p>
                      <p className="text-xs text-gray-500">Yesterday at 4:45 PM</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}