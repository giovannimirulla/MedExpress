"use client";

import Link from 'next/link';
import { useAuth } from '@/context/authContext';

type HeadingProps = {
  position?: "absolute" | "relative";
  navColor?: "transparent" | "primary"; // nuova proprietà per definire il colore della navbar
};

const Heading = ({ position = "absolute", navColor = "transparent" }: HeadingProps) => {
  const { isLoggedIn } = useAuth();
  const navPositionClass = position;
  const bgClass = navColor === "primary" ? "bg-primary" : "bg-transparent";

  return (
    <header>
      <nav
        id="nav"
        className={`${navPositionClass} ${bgClass} h-24 flex items-center group z-10 w-full lg:border-transparent`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
          <div className="relative flex flex-wrap items-center justify-between ">
            <div className="relative z-20 flex w-full justify-between md:px-0 lg:w-fit">
              <Link
                href="/"
                aria-label="logo"
                className="flex items-center space-x-2 no-underline"
              >
                <div aria-hidden="true" className="flex space-x-1">
                  <div className="h-6 w-2 bg-primary"></div>
                </div>
                <span className="text-2xl font-bold text-body">MedExpress</span>
              </Link>

              <div className="relative flex max-h-10 items-center lg:hidden">
                <button
                  aria-label="humburger"
                  id="hamburger"
                  className="relative -mr-6 p-6 active:scale-95 duration-300"
                >
                  <div
                    aria-hidden="true"
                    id="line"
                    className="m-auto h-0.5 w-5 rounded bg-gray-950 transition duration-300 dark:bg-white origin-top group-data-[state=active]:rotate-45 group-data-[state=active]:translate-y-1.5"
                  ></div>
                  <div
                    aria-hidden="true"
                    id="line2"
                    className="m-auto mt-2 h-0.5 w-5 rounded bg-gray-950 transition duration-300 dark:bg-white origin-bottom group-data-[state=active]:-rotate-45 group-data-[state=active]:-translate-y-1"
                  ></div>
                </button>
              </div>
            </div>
            <div
              id="navLayer"
              aria-hidden="true"
              className="fixed inset-0 z-10 h-screen w-screen origin-bottom scale-y-0 bg-white/70 backdrop-blur-2xl transition duration-500 group-data-[state=active]:origin-top group-data-[state=active]:scale-y-100 dark:bg-gray-950/70 lg:hidden"
            ></div>
            <div
              id="navlinks"
              className="invisible absolute top-full left-0 z-20 w-full origin-top-right translate-y-1 scale-90 flex-col flex-wrap justify-end gap-6 rounded-3xl border border-gray-100 bg-white p-8 opacity-0 shadow-2xl shadow-gray-600/10 transition-all duration-300 dark:border-gray-700 dark:bg-gray-800 dark:shadow-none lg:visible lg:relative lg:flex lg:w-fit lg:translate-y-0 lg:scale-100 lg:flex-row lg:items-center lg:gap-0 lg:border-none lg:bg-transparent lg:p-0 lg:opacity-100 lg:shadow-none lg:dark:bg-transparent group-data-[state=active]:visible group-data-[state=active]:scale-100 group-data-[state=active]:opacity-100 lg:group-data-[state=active]:translate-y-0"
            >
              <div className="flex items-center mr-[20px]">
                {/* Altri link o contenuti della navigazione */}
              </div>
              <div className="flex items-center gap-4">
                {isLoggedIn() ? (
                  <Link
                    href="/dashboard"
                    className="text-sm font-medium bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark"
                  >
                    Dashboard
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="text-sm font-medium dark:text-white text-gray-700 hover:underline"
                    >
                      Login
                    </Link>
                    <Link
                      href="/signup"
                      className="text-sm font-medium bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Heading;