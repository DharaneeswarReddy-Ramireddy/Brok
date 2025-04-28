import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { AlignRight, X, User, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAuth } from "@/hooks/use-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [, navigate] = useLocation();
  const { user, logoutMutation } = useAuth();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
    navigate("/");
  };

  return (
    <header className="bg-background shadow sticky top-0 z-50 dark:bg-gray-900 dark:border-b dark:border-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link href="/">
              <a className="text-primary font-bold text-2xl">ResumeAI</a>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/">
              <a className="text-foreground hover:text-primary font-medium transition">
                Home
              </a>
            </Link>
            <Link href="/try-free">
              <a className="text-foreground hover:text-primary font-medium transition">
                Try Free
              </a>
            </Link>
            <a href="#features" className="text-foreground hover:text-primary font-medium transition">
              Features
            </a>
            <a href="#pricing" className="text-foreground hover:text-primary font-medium transition">
              Pricing
            </a>
          </div>

          <div className="flex items-center space-x-4">
            <ThemeToggle />
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="rounded-full">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button
                  variant="ghost"
                  className="hidden md:inline-block"
                  onClick={() => navigate("/auth")}
                >
                  Login
                </Button>
                <Button 
                  variant="default" 
                  className="bg-primary hover:bg-blue-600"
                  onClick={() => navigate("/get-started")}
                >
                  Get Started
                </Button>
              </>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <AlignRight className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={cn(
            "md:hidden border-t transition-all duration-300 ease-in-out overflow-hidden dark:border-gray-800",
            mobileMenuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className="px-2 pt-2 pb-4 space-y-1">
            <Link href="/">
              <a
                className="block px-3 py-2 rounded-md text-base font-medium hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </a>
            </Link>
            <Link href="/try-free">
              <a
                className="block px-3 py-2 rounded-md text-base font-medium hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800"
                onClick={() => setMobileMenuOpen(false)}
              >
                Try Free
              </a>
            </Link>
            <a
              href="#features"
              className="block px-3 py-2 rounded-md text-base font-medium hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </a>
            <a
              href="#pricing"
              className="block px-3 py-2 rounded-md text-base font-medium hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </a>
            {!user ? (
              <Link href="/auth">
                <a
                  className="block px-3 py-2 rounded-md text-base font-medium hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login / Register
                </a>
              </Link>
            ) : (
              <>
                <Link href="/dashboard">
                  <a
                    className="block px-3 py-2 rounded-md text-base font-medium hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </a>
                </Link>
                <a
                  className="block px-3 py-2 rounded-md text-base font-medium hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                >
                  Logout
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
