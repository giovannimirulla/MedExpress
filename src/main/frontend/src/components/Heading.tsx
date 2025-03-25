"use client";

import Link from "next/link";
import { useAuth } from "@/context/authContext";
import { Button } from "antd";
import { useState, useEffect } from "react";

type HeadingProps = {
  position?: "absolute" | "relative";
  navColor?: "transparent" | "primary";
};

const Heading = ({ position = "absolute", navColor = "transparent" }: HeadingProps) => {
  const { isLoggedIn, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Chiudi il menu quando la finestra viene ridimensionata oltre il breakpoint lg
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMenuOpen(false);
      }
    };
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  
  return (
    <header>
      <nav className={`h-24 flex items-center z-10 w-full ${position} ${navColor === "primary" ? "bg-primary" : "bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-5 md:px-10 w-full flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-body">
            MedExpress
          </Link>

          {/* Hamburger Menu Button */}
          <button
            className="lg:hidden p-4 flex flex-col gap-1 hover:bg-primary/10 rounded"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle Menu"
          >
            <span className={`h-1 w-6 bg-black transition-transform ${isMenuOpen ? "rotate-45 translate-y-2" : ""}`}></span>
            <span className={`h-1 w-6 bg-black transition-opacity ${isMenuOpen ? "opacity-0" : ""}`}></span>
            <span className={`h-1 w-6 bg-black transition-transform ${isMenuOpen ? "-rotate-45 -translate-y-2" : ""}`}></span>
          </button>

          {/* Menu Links */}
          <div
            className={`absolute top-full left-0 w-full bg-white lg:bg-transparent lg:flex lg:static lg:justify-end transition-all ${isMenuOpen ? "flex flex-col p-2 space-y-2" : "hidden lg:flex lg:space-x-4 lg:p-0"}`}
          >
            {isLoggedIn() ? (
              <>
                <Link href="/dashboard" className="text-sm font-medium bg-primary text-white px-4 py-2 rounded text-center flex items-center justify-center hover:bg-primary-dark">
                  Dashboard
                </Link>
                <Button onClick={logout} className="text-sm font-medium dark:text-white text-gray-700 px-4 py-2 text-center flex items-center justify-center" type="text">
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium dark:text-white text-gray-700 hover:underline px-4 py-2 text-center flex items-center justify-center">
                  Login
                </Link>
                <Link href="/signup" className="text-sm font-medium bg-primary text-white px-4 py-2 rounded text-center flex items-center justify-center hover:bg-primary-dark">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Heading;
