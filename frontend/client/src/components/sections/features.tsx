import { 
  CheckCircle, 
  Eye, 
  FileText, 
  Edit, 
  ArrowRight, 
  ClipboardList 
} from "lucide-react";

const features = [
  {
    icon: <CheckCircle className="h-6 w-6 text-primary" />,
    title: "ATS Score Analysis",
    description: "Get a detailed score showing how well your resume matches the job description and ATS requirements.",
  },
  {
    icon: <Eye className="h-6 w-6 text-primary" />,
    title: "Keyword Optimization",
    description: "Identify missing keywords and phrases that are crucial for passing ATS filters and impressing recruiters.",
  },
  {
    icon: <FileText className="h-6 w-6 text-primary" />,
    title: "Format Checking",
    description: "Ensure your resume format is compatible with ATS systems to prevent parsing errors and information loss.",
  },
  {
    icon: <Edit className="h-6 w-6 text-primary" />,
    title: "Content Suggestions",
    description: "Get AI-powered recommendations to improve your bullet points, achievements, and skills sections.",
  },
  {
    icon: <ArrowRight className="h-6 w-6 text-primary" />,
    title: "Industry Tailoring",
    description: "Customize your resume for specific industries with tailored recommendations for different career fields.",
  },
  {
    icon: <ClipboardList className="h-6 w-6 text-primary" />,
    title: "Resume Templates",
    description: "Access a library of ATS-optimized resume templates designed for different industries and experience levels.",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Powerful Resume Optimization Features</h2>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Everything you need to create a professional, ATS-friendly resume that stands out.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 hover:shadow-md transition">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 dark:text-white">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
