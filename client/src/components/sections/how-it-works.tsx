import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900">How ResumeAI Works</h2>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Optimize your resume in three simple steps
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-primary font-bold text-xl">1</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Upload Your Resume</h3>
            <p className="text-gray-600">
              Upload your current resume in PDF or DOCX format to our secure platform.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-primary font-bold text-xl">2</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Add Job Description</h3>
            <p className="text-gray-600">
              Paste the job description to get tailored optimization suggestions.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-primary font-bold text-xl">3</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Get Your Score & Optimize</h3>
            <p className="text-gray-600">
              Receive your ATS compatibility score and detailed improvement suggestions.
            </p>
          </div>
        </div>

        <div className="mt-16 bg-gray-50 rounded-xl p-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-semibold mb-4">See Our Tool in Action</h3>
              <p className="text-gray-600 mb-6">
                Watch how easily you can optimize your resume and improve your chances of landing interviews.
              </p>
              <Button variant="link" className="inline-flex items-center text-primary font-medium hover:text-blue-700">
                Schedule a Demo
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </Button>
            </div>
            <div className="relative aspect-video rounded-lg overflow-hidden shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=450&q=80"
                alt="Resume optimization in action"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-primary bg-opacity-90 rounded-full flex items-center justify-center cursor-pointer hover:bg-opacity-100 transition">
                  <Play className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
