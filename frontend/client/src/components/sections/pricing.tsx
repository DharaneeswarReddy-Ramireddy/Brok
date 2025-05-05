import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PricingToggle } from "@/components/ui/pricing-toggle";
import { usePricingToggle } from "@/hooks/use-pricing-toggle";
import { useState } from "react";

export default function Pricing() {
  const { pricing, toggle } = usePricingToggle();

  return (
    <section id="pricing" className="py-16 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Simple, Transparent Pricing</h2>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Choose the plan that fits your job search needs
          </p>

          <PricingToggle onToggle={toggle} />
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Free Plan */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow transition p-6 dark:bg-gray-800">
            <div className="text-center pb-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Free</h3>
              <div className="mt-4 flex items-baseline justify-center">
                <span className="text-4xl font-bold text-gray-900 dark:text-white">${pricing.prices.free}</span>
                <span className="ml-1 text-gray-600 dark:text-gray-400">/month</span>
              </div>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">For casual job seekers</p>
            </div>

            <ul className="mt-6 space-y-4">
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                <span className="text-gray-600 dark:text-gray-300">Basic ATS Score</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                <span className="text-gray-600 dark:text-gray-300">2 Resume Analyses per Month</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                <span className="text-gray-600 dark:text-gray-300">Limited Keyword Suggestions</span>
              </li>
              <li className="flex items-start">
                <X className="h-5 w-5 text-gray-400 mt-0.5 mr-2" />
                <span className="text-gray-500 dark:text-gray-500">Advanced Optimization</span>
              </li>
              <li className="flex items-start">
                <X className="h-5 w-5 text-gray-400 mt-0.5 mr-2" />
                <span className="text-gray-500 dark:text-gray-500">Job-Specific Templates</span>
              </li>
            </ul>

            <div className="mt-8">
              <Button
                variant="outline"
                className="block w-full border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-white"
              >
                Get Started Free
              </Button>
            </div>
          </div>

          {/* Premium Plan */}
          <div className="border-2 border-primary rounded-xl shadow-md hover:shadow-lg transition p-6 transform md:-translate-y-4 relative dark:bg-gray-800">
            <div className="absolute -top-3 right-10">
              <span className="bg-accent text-white text-xs font-semibold px-3 py-1 rounded-full uppercase">
                Popular
              </span>
            </div>
            <div className="text-center pb-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Premium</h3>
              <div className="mt-4 flex items-baseline justify-center">
                <span className="text-4xl font-bold text-gray-900 dark:text-white">${pricing.prices.premium}</span>
                <span className="ml-1 text-gray-600 dark:text-gray-400">/month</span>
              </div>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">For active job seekers</p>
            </div>

            <ul className="mt-6 space-y-4">
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                <span className="text-gray-600 dark:text-gray-300">Advanced ATS Score Analysis</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                <span className="text-gray-600 dark:text-gray-300">Unlimited Resume Analyses</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                <span className="text-gray-600 dark:text-gray-300">Complete Keyword Optimization</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                <span className="text-gray-600 dark:text-gray-300">Advanced Content Suggestions</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                <span className="text-gray-600 dark:text-gray-300">20+ ATS-Optimized Templates</span>
              </li>
            </ul>

            <div className="mt-8">
              <Button className="block w-full bg-primary hover:bg-blue-600">
                Get Premium
              </Button>
            </div>
          </div>

          {/* Pro Plan */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow transition p-6 dark:bg-gray-800">
            <div className="text-center pb-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Professional</h3>
              <div className="mt-4 flex items-baseline justify-center">
                <span className="text-4xl font-bold text-gray-900 dark:text-white">${pricing.prices.professional}</span>
                <span className="ml-1 text-gray-600 dark:text-gray-400">/month</span>
              </div>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">For serious career advancement</p>
            </div>

            <ul className="mt-6 space-y-4">
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                <span className="text-gray-600 dark:text-gray-300">Everything in Premium</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                <span className="text-gray-600 dark:text-gray-300">1-on-1 Expert Resume Review</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                <span className="text-gray-600 dark:text-gray-300">LinkedIn Profile Optimization</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                <span className="text-gray-600 dark:text-gray-300">Cover Letter AI Assistant</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                <span className="text-gray-600 dark:text-gray-300">Interview Preparation Tools</span>
              </li>
            </ul>

            <div className="mt-8">
              <Button
                variant="outline"
                className="block w-full border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-white"
              >
                Get Professional
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-500 dark:text-gray-400">Need a custom solution for your team or company?</p>
          <a
            href="#"
            className="mt-2 inline-block text-primary font-medium hover:text-blue-700 dark:hover:text-blue-400 transition"
          >
            Contact us for Enterprise pricing
          </a>
        </div>
      </div>
    </section>
  );
}
