import { useState } from "react";
import { useLocation } from "wouter";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function GetStarted() {
  const [, navigate] = useLocation();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handlePlanSelect = (plan: string) => {
    setSelectedPlan(plan);
  };

  const handleContinue = () => {
    if (selectedPlan) {
      navigate("/auth");
    }
  };

  const plans = [
    {
      id: "free",
      name: "Free",
      price: "0",
      badge: "",
      description: "For casual job seekers",
      features: [
        "Basic ATS Score",
        "2 Resume Analyses per Month",
        "Limited Keyword Suggestions",
      ],
    },
    {
      id: "premium",
      name: "Premium",
      price: "19",
      badge: "Most Popular",
      description: "For active job seekers",
      features: [
        "Advanced ATS Score Analysis",
        "Unlimited Resume Analyses",
        "Complete Keyword Optimization",
        "Advanced Content Suggestions",
        "20+ ATS-Optimized Templates",
      ],
    },
    {
      id: "professional",
      name: "Professional",
      price: "39",
      badge: "",
      description: "For serious career advancement",
      features: [
        "Everything in Premium",
        "1-on-1 Expert Resume Review",
        "LinkedIn Profile Optimization",
        "Cover Letter AI Assistant",
        "Interview Preparation Tools",
      ],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-3xl font-bold mb-4">Get Started with ResumeAI</h1>
            <p className="text-xl text-gray-600">
              Choose a plan that works for you and start optimizing your resume today
            </p>
          </div>
          
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <Card 
                  key={plan.id}
                  className={`border-2 transition-all ${
                    selectedPlan === plan.id
                      ? "border-primary shadow-lg scale-105"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => handlePlanSelect(plan.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold">{plan.name}</h3>
                        <p className="text-sm text-gray-600">{plan.description}</p>
                      </div>
                      {plan.badge && (
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                          {plan.badge}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="mb-4">
                      <span className="text-3xl font-bold">${plan.price}</span>
                      <span className="text-gray-600">/month</span>
                    </div>
                    
                    <ul className="space-y-2 mb-6">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Button
                      variant={selectedPlan === plan.id ? "default" : "outline"}
                      className={`w-full ${selectedPlan === plan.id ? "" : "border-gray-300"}`}
                    >
                      {selectedPlan === plan.id ? "Selected" : "Select Plan"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="mt-10 text-center">
              <Button 
                size="lg"
                disabled={!selectedPlan}
                onClick={handleContinue}
                className="px-8"
              >
                Continue
              </Button>
              <p className="mt-4 text-gray-600">
                You can change your plan anytime from your account settings
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}