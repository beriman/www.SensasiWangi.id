import { UserButton, useUser } from "@clerk/clerk-react";
import {
  Authenticated,
  Unauthenticated,
  useMutation,
  useQuery,
} from "convex/react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../../convex/_generated/api";
import { Button } from "./ui/button";
import { ThemeToggle } from "./theme-toggle";
import { Sheet, SheetTrigger, SheetContent } from "./ui/sheet";
import { Menu } from "lucide-react";

export function Navbar() {
  const { user, isLoaded } = useUser();
  const createOrUpdateUser = useMutation(api.users.createOrUpdateUser);
  useEffect(() => {
    if (user) {
      createOrUpdateUser();
    }
  }, [user, createOrUpdateUser]);

  return (
    <nav className="sticky top-0 w-full neumorphic-card border-0 z-50 mx-4 mt-4 rounded-3xl">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-base font-medium text-[#1D1D1F]">
              SensasiWangi.id
            </span>
          </Link>

          <div className="flex-1"></div>

          {isLoaded ? (
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Authenticated>
                <div className="hidden md:flex items-center gap-3">
                  <Link
                    to="/dashboard"
                    className="neumorphic-button-sm inline-flex items-center px-4 py-2 text-sm font-medium text-[#1D1D1F] bg-transparent transition-all duration-200 border-0 shadow-none hover:scale-105 active:scale-95"
                  >
                    <svg
                      className="w-4 h-4 mr-1.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                    Dashboard
                  </Link>
                  <Link
                    to="/forum"
                    className="neumorphic-button-sm inline-flex items-center px-4 py-2 text-sm font-medium text-[#1D1D1F] bg-transparent transition-all duration-200 border-0 shadow-none hover:scale-105 active:scale-95"
                  >
                    <svg
                      className="w-4 h-4 mr-1.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2H9l-4 4z"
                      />
                    </svg>
                    Forum
                  </Link>
                  <Link
                    to="/marketplace"
                    className="neumorphic-button-sm inline-flex items-center px-4 py-2 text-sm font-medium text-[#1D1D1F] bg-transparent transition-all duration-200 border-0 shadow-none hover:scale-105 active:scale-95"
                  >
                    <svg
                      className="w-4 h-4 mr-1.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M16 11V7a4 4 0 00-8 0v4M8 11v6h8v-6M8 11H6a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2v-6a2 2 0 00-2-2h-2"
                      />
                    </svg>
                    Marketplace
                  </Link>
                  <Link
                    to="/kursus"
                    className="neumorphic-button-sm inline-flex items-center px-4 py-2 text-sm font-medium text-[#1D1D1F] bg-transparent transition-all duration-200 border-0 shadow-none hover:scale-105 active:scale-95"
                  >
                    <svg
                      className="w-4 h-4 mr-1.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                    Kursus
                  </Link>
                  <Link
                    to="/polling"
                    className="neumorphic-button-sm inline-flex items-center px-4 py-2 text-sm font-medium text-[#1D1D1F] bg-transparent transition-all duration-200 border-0 shadow-none hover:scale-105 active:scale-95"
                  >
                    <svg
                      className="w-4 h-4 mr-1.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M3 3v16a2 2 0 0 0 2 2h16"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M7 16h8"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M7 11h12"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M7 6h3"
                      />
                    </svg>
                    Polling
                  </Link>
                  <Link
                    to="/profile"
                    className="neumorphic-button-sm inline-flex items-center px-4 py-2 text-sm font-medium text-[#1D1D1F] bg-transparent transition-all duration-200 border-0 shadow-none hover:scale-105 active:scale-95"
                  >
                    <svg
                      className="w-4 h-4 mr-1.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    Profil
                  </Link>
                  <UserButton
                    afterSignOutUrl="/"
                    appearance={{
                      elements: {
                        avatarBox:
                          "w-8 h-8 rounded-full neumorphic-button-sm border-0",
                        userButtonPopoverCard:
                          "neumorphic-card border-0 shadow-none",
                        userButtonPopoverActionButton:
                          "neumorphic-button-sm text-[#2d3748] hover:bg-transparent",
                      },
                    }}
                  />
                </div>
                <div className="md:hidden">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="ghost" size="icon" className="neumorphic-button-sm border-0 shadow-none bg-transparent">
                        <Menu className="w-5 h-5" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="pt-10 flex flex-col space-y-4 neumorphic-bg">
                      <Link to="/dashboard" className="neumorphic-button-sm w-full text-left">Dashboard</Link>
                      <Link to="/forum" className="neumorphic-button-sm w-full text-left">Forum</Link>
                      <Link to="/marketplace" className="neumorphic-button-sm w-full text-left">Marketplace</Link>
                      <Link to="/kursus" className="neumorphic-button-sm w-full text-left">Kursus</Link>
                      <Link to="/polling" className="neumorphic-button-sm w-full text-left">Polling</Link>
                      <Link to="/profile" className="neumorphic-button-sm w-full text-left">Profil</Link>
                      <UserButton
                        afterSignOutUrl="/"
                        appearance={{
                          elements: {
                            avatarBox: "w-8 h-8 rounded-full neumorphic-button-sm border-0",
                            userButtonPopoverCard: "neumorphic-card border-0 shadow-none",
                            userButtonPopoverActionButton: "neumorphic-button-sm text-[#2d3748] hover:bg-transparent",
                          },
                        }}
                      />
                    </SheetContent>
                  </Sheet>
                </div>
              </Authenticated>
              <Unauthenticated>
                <Link
                  to="/forum"
                  className="neumorphic-button-sm inline-flex items-center px-4 py-2 text-sm font-medium text-[#1D1D1F] bg-transparent transition-all duration-200 border-0 shadow-none hover:scale-105 active:scale-95"
                >
                  <svg
                    className="w-4 h-4 mr-1.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2H9l-4 4z"
                    />
                  </svg>
                  Forum
                </Link>
                <Link to="/login">
                  <Button className="neumorphic-button h-10 px-6 text-sm text-[#2d3748] bg-transparent font-semibold border-0 shadow-none transition-all hover:scale-105 active:scale-95">
                    Masuk
                  </Button>
                </Link>
                <div className="md:hidden">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="ghost" size="icon" className="neumorphic-button-sm border-0 shadow-none bg-transparent">
                        <Menu className="w-5 h-5" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="pt-10 flex flex-col space-y-4 neumorphic-bg">
                      <Link to="/login" className="neumorphic-button-sm w-full text-left">Masuk</Link>
                      <Link to="/forum" className="neumorphic-button-sm w-full text-left">Forum</Link>
                      <Link to="/signup" className="neumorphic-button-sm w-full text-left">Daftar</Link>
                    </SheetContent>
                  </Sheet>
                </div>
              </Unauthenticated>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <div className="flex items-center gap-4">
                <div className="h-4 w-16 bg-[#F5F5F7] rounded-full animate-pulse"></div>
                <div className="h-8 w-8 rounded-full bg-[#F5F5F7] animate-pulse"></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
