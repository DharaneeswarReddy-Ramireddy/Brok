import { Button } from "@/components/ui/button";

export default function CTA() {
  return (
    <section className="py-12 bg-primary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Land More Interviews?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of job seekers who have improved their resumes and landed their dream jobs.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button
              size="lg"
              className="bg-white text-primary hover:bg-blue-50"
            >
              Get Started For Free
            </Button>
            <Button
              size="lg" 
              variant="outline"
              className="border-white text-white hover:bg-blue-600"
            >
              See Pricing Plans
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
