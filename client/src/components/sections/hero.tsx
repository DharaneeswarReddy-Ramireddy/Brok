import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FileUpload } from "@/components/ui/file-upload";
import { apiRequest } from "@/lib/queryClient";
import { submitForATSScoring } from "@/lib/ats-scoring";
import { useToast } from "@/hooks/use-toast";
import { Star } from "lucide-react";

export default function Hero() {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadedResumeId, setUploadedResumeId] = useState<number | null>(null);
  const { toast } = useToast();

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

      // Navigate to results page or show results
      toast({
        title: "Analysis complete!",
        description: `Your resume received an ATS score of ${result.score}%`,
      });
      
      // In a real app, you might navigate to a results page:
      // navigate(`/results/${resumeId}`);
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
    <section className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 py-12 sm:py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center lg:space-x-12">
          <div className="lg:w-1/2 mb-8 lg:mb-0">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
              Get Your Resume <span className="text-primary">Noticed</span> by Employers and ATS Systems
            </h1>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 max-w-lg">
              Our AI-powered resume optimization tool helps you beat Applicant Tracking Systems (ATS) and land more interviews with personalized recommendations.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Button
                size="lg"
                className="bg-primary hover:bg-blue-600 text-white"
                asChild
              >
                <a href="/try-free">Try For Free</a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-gray-300 hover:border-primary text-gray-700 hover:text-primary"
                asChild
              >
                <a href="#how-it-works">Learn More</a>
              </Button>
            </div>
            <div className="mt-8 flex items-center">
              <div className="flex -space-x-2">
                <div className="h-8 w-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center overflow-hidden">
                  <img 
                    src="https://randomuser.me/api/portraits/women/44.jpg" 
                    alt="Customer"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="h-8 w-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center overflow-hidden">
                  <img 
                    src="https://randomuser.me/api/portraits/men/46.jpg" 
                    alt="Customer"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="h-8 w-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center overflow-hidden">
                  <img 
                    src="https://randomuser.me/api/portraits/women/65.jpg" 
                    alt="Customer"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
              <div className="ml-4">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Trusted by 10,000+ job seekers</span>
                <div className="flex items-center mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                  <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">4.9/5</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:w-1/2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 sm:p-8">
              <h3 className="text-xl font-semibold mb-4 dark:text-white">Check Your Resume's ATS Score</h3>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Upload Your Resume</label>
                <FileUpload 
                  onFileSelected={setResumeFile}
                  supportedFormats={[".pdf", ".docx"]}
                  maxSizeMB={5}
                />
              </div>

              <div className="mb-6">
                <label htmlFor="job-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Job Description
                </label>
                <Textarea
                  id="job-description"
                  rows={4}
                  placeholder="Paste the job description here for best results..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-primary focus:border-primary"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />
              </div>

              <Button
                className="w-full bg-primary hover:bg-blue-600 text-white font-medium"
                disabled={isAnalyzing}
                onClick={handleAnalyzeResume}
              >
                {isAnalyzing ? "Analyzing..." : "Analyze My Resume"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
