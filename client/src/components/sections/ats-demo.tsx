import { Check, X } from "lucide-react";

export default function AtsDemo() {
  return (
    <section className="py-16 bg-gradient-to-br from-gray-900 to-blue-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold">See How ATS Systems Read Your Resume</h2>
          <p className="mt-4 text-xl text-gray-300 max-w-3xl mx-auto">
            Most companies use Applicant Tracking Systems to filter candidates. Here's what happens to your resume.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="bg-gray-800 rounded-xl p-6 shadow-xl">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <span className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-2 text-sm">
                <X className="h-4 w-4" />
              </span>
              Non-Optimized Resume
            </h3>
            <div className="bg-gray-700 rounded-lg p-4 mb-4">
              <div className="border-l-4 border-red-500 pl-4 mb-4">
                <p className="text-red-300 font-medium mb-1">Missing Keywords</p>
                <p className="text-gray-300 text-sm">Project management, Agile methodology, Scrum</p>
              </div>
              <div className="border-l-4 border-red-500 pl-4 mb-4">
                <p className="text-red-300 font-medium mb-1">Format Issues</p>
                <p className="text-gray-300 text-sm">
                  Tables, complex formatting, and headers/footers cause parsing errors
                </p>
              </div>
              <div className="border-l-4 border-red-500 pl-4">
                <p className="text-red-300 font-medium mb-1">Vague Achievements</p>
                <p className="text-gray-300 text-sm">Lacks specific metrics and quantifiable results</p>
              </div>
            </div>
            <div className="flex items-center justify-between bg-gray-800 p-2 rounded">
              <div>
                <span className="text-sm text-gray-400">ATS Score</span>
                <div className="flex items-center">
                  <div className="w-24 h-2 bg-gray-600 rounded-full mr-2">
                    <div className="w-8 h-2 bg-red-500 rounded-full"></div>
                  </div>
                  <span className="text-red-400 font-medium">35%</span>
                </div>
              </div>
              <div>
                <span className="text-sm text-gray-400">Result</span>
                <p className="text-red-400 font-medium">Rejected by ATS</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 shadow-xl">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <span className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-2 text-sm">
                <Check className="h-4 w-4" />
              </span>
              ResumeAI Optimized
            </h3>
            <div className="bg-gray-700 rounded-lg p-4 mb-4">
              <div className="border-l-4 border-green-500 pl-4 mb-4">
                <p className="text-green-300 font-medium mb-1">Targeted Keywords</p>
                <p className="text-gray-300 text-sm">
                  Strategically placed relevant keywords matching job requirements
                </p>
              </div>
              <div className="border-l-4 border-green-500 pl-4 mb-4">
                <p className="text-green-300 font-medium mb-1">ATS-Friendly Format</p>
                <p className="text-gray-300 text-sm">Clean structure with standard headers that parse correctly</p>
              </div>
              <div className="border-l-4 border-green-500 pl-4">
                <p className="text-green-300 font-medium mb-1">Quantified Achievements</p>
                <p className="text-gray-300 text-sm">Specific metrics and results that highlight your impact</p>
              </div>
            </div>
            <div className="flex items-center justify-between bg-gray-800 p-2 rounded">
              <div>
                <span className="text-sm text-gray-400">ATS Score</span>
                <div className="flex items-center">
                  <div className="w-24 h-2 bg-gray-600 rounded-full mr-2">
                    <div className="w-20 h-2 bg-green-500 rounded-full"></div>
                  </div>
                  <span className="text-green-400 font-medium">92%</span>
                </div>
              </div>
              <div>
                <span className="text-sm text-gray-400">Result</span>
                <p className="text-green-400 font-medium">Passed to Recruiter</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
