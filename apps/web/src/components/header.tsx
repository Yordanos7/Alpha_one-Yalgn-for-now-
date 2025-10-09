"use client";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/5 backdrop-blur-md border-b border-border shadow-sm">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-lg bg-gradient-ethiopian flex items-center justify-center text-white font-bold text-xl transition-transform group-hover:scale-110">
              Y
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary via-gold to-secondary bg-clip-text text-transparent">
              Yalegn
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              How It Works
            </Link>
            <Link
              to="/marketplace"
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Marketplace
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link to="/signup">
              <Button variant="default" size="lg">
                Sign Up
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 flex flex-col gap-4 animate-fade-in">
            <Link
              to="/"
              className="text-foreground hover:text-primary transition-colors font-medium py-2"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="text-foreground hover:text-primary transition-colors font-medium py-2"
            >
              How It Works
            </Link>
            <Link
              to="/marketplace"
              className="text-foreground hover:text-primary transition-colors font-medium py-2"
            >
              Marketplace
            </Link>
            <div className="flex flex-col gap-3 pt-4 border-t">
              <Link to="/login">
                <Button variant="ghost" className="w-full">
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button variant="default" className="w-full">
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
