"use client";

import Link from "next/link";
import { useAuth } from "@/context/authContext";
import { Button } from "antd";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCapsules, faHouse, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";

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
      <nav className={`h-24 flex items-center z-10 w-full  ${position} ${navColor === "primary" ? "bg-primary" : "bg-transparent"} ${position === "relative" ? "ring-1 ring-black/5" : ""} transition-all duration-300`}>
        <div className="max-w-7xl mx-auto px-5 md:px-10 w-full flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-body">
          <FontAwesomeIcon icon={faCapsules} className="text-primary " />
            MedExpress
          </Link>

          {/* Hamburger Menu Button */}
            <button
              className="lg:hidden p-4 flex flex-col gap-1 hover:bg-primary/10 dark:hover:bg-white/10 rounded transition-all duration-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle Menu"
            >
              <span className={`h-1 w-6 bg-black dark:bg-white transition-transform duration-300 ${isMenuOpen ? "rotate-45 translate-y-2" : ""}`}></span>
              <span className={`h-1 w-6 bg-black dark:bg-white transition-opacity duration-300 ${isMenuOpen ? "opacity-0" : ""}`}></span>
              <span className={`h-1 w-6 bg-black dark:bg-white transition-transform duration-300 ${isMenuOpen ? "-rotate-45 -translate-y-2" : ""}`}></span>
            </button>

          {/* Menu Links */}
            <div
              className={`absolute top-full right-4 left-4  rounded-xl bg-white/20 shadow-lg ring-1 ring-black/5 lg:shadow-none lg:ring-0 lg:bg-transparent lg:static lg:justify-end transition-all transform duration-300 backdrop-blur-md lg:backdrop-filter-none ${
              isMenuOpen
                ? " opacity-100 translate-y-0 pointer-events-auto"
                : "opacity-0 -translate-y-4 pointer-events-none"
              } p-4 lg:opacity-100 lg:translate-y-0 lg:pointer-events-auto lg:space-x-4 lg:p-0`}
            >
              <div className="flex gap-y-4 lg:gap-x-4 flex-col lg:flex-row items-center justify-center w-full lg:w-auto">
            {isLoggedIn() ? (
              <>
                <Link href="/dashboard" className="text-sm font-medium bg-primary text-white px-4 py-2 rounded text-center flex items-center justify-center hover:bg-primary-dark w-full lg:w-auto">
                  <FontAwesomeIcon icon={faHouse} className="mr-2" />
                  Dashboard
                </Link>
                <Button
                  onClick={logout}
                  className="text-sm font-medium dark:text-white text-gray-700 px-4 py-2 text-center flex items-center justify-center w-full lg:w-auto hover:bg-primary/10 dark:hover:bg-white/10 rounded transition-all duration-300"
                  type="text"
                >
                  <FontAwesomeIcon icon={faRightFromBracket} className="mr-2" />
                  <span className="lg:hidden inline">Logout</span>
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium dark:text-white text-gray-700 hover:underline px-4 py-2 text-center flex items-center justify-center w-full lg:w-auto hover:bg-primary/10 dark:hover:bg-white/10 rounded transition-all duration-300">
                  Login
                </Link>
                <Link href="/signup" className="text-sm font-medium bg-primary text-white px-4 py-2 rounded text-center flex items-center justify-center hover:bg-primary-dark w-full lg:w-auto">
                  Sign Up
                </Link>
              </>
            )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Heading;
