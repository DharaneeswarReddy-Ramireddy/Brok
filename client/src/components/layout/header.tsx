import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { AlignRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link href="/">
              <a className="text-primary font-bold text-2xl">ResumeAI</a>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 hover:text-primary font-medium transition">
              Features
            </a>
            <a href="#how-it-works" className="text-gray-600 hover:text-primary font-medium transition">
              How It Works
            </a>
            <a href="#pricing" className="text-gray-600 hover:text-primary font-medium transition">
              Pricing
            </a>
            <a href="#testimonials" className="text-gray-600 hover:text-primary font-medium transition">
              Testimonials
            </a>
          </div>

          <div className="flex items-center space-x-4">
            <Button
              variant="link"
              className="hidden md:inline-block text-gray-600 hover:text-primary font-medium transition"
            >
              Login
            </Button>
            <Button variant="default" className="bg-primary hover:bg-blue-600">
              Get Started
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-gray-600" />
              ) : (
                <AlignRight className="h-6 w-6 text-gray-600" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={cn(
            "md:hidden border-t transition-all duration-300 ease-in-out overflow-hidden",
            mobileMenuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className="px-2 pt-2 pb-4 space-y-1">
            <a
              href="#features"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              How It Works
            </a>
            <a
              href="#pricing"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </a>
            <a
              href="#testimonials"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              Testimonials
            </a>
            <a
              href="#"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              Login
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
