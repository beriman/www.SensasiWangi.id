import { SignInButton, UserButton, useUser } from "@clerk/clerk-react";
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
              </Authenticated>
              <Unauthenticated>
                <SignInButton
                  mode="modal"
                  signUpFallbackRedirectUrl="/dashboard"
                  signInFallbackRedirectUrl="/dashboard"
                >
                  <Button className="neumorphic-button h-10 px-6 text-sm text-[#2d3748] bg-transparent font-semibold border-0 shadow-none transition-all hover:scale-105 active:scale-95">
                    Masuk
                  </Button>
                </SignInButton>
              </Unauthenticated>
            </div>
          ) : (
            <div className="flex items-center gap-4">
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
