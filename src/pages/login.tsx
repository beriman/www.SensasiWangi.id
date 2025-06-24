import { SignIn, useUser } from "@clerk/clerk-react";
import { useMutation } from "convex/react";
import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { api } from "../../convex/_generated/api";

export default function Login() {
  const { isSignedIn, user, isLoaded } = useUser();
  const navigate = useNavigate();
  const createOrUpdateUser = useMutation(api.users.createOrUpdateUser);

  // Handle user session creation after successful login
  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      // Create or update user in database
      createOrUpdateUser()
        .then(() => {
          // Redirect to dashboard after successful user creation/update
          navigate("/dashboard", { replace: true });
        })
        .catch((error) => {
          console.error("Error creating/updating user:", error);
          // Still redirect to dashboard even if there's an error
          navigate("/dashboard", { replace: true });
        });
    }
  }, [isLoaded, isSignedIn, user, createOrUpdateUser, navigate]);

  // Show loading while Clerk is initializing
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex flex-col neumorphic-bg">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <p className="text-gray-600">Memuat...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Redirect if already signed in
  if (isSignedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col neumorphic-bg">
      <Navbar />
      <main className="flex-grow flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="neumorphic-card p-8 mb-6">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-semibold text-[#1D1D1F] mb-2">
                Masuk ke Akun Anda
              </h1>
              <p className="text-[#86868B]">
                Selamat datang kembali! Silakan masuk ke akun Anda.
              </p>
            </div>
            <SignIn
              path="/login"
              routing="path"
              signUpUrl="/signup"
              afterSignInUrl="/dashboard"
              appearance={{
                elements: {
                  formButtonPrimary:
                    "neumorphic-button bg-transparent text-[#2d3748] font-semibold border-0 shadow-none hover:scale-105 active:scale-95 transition-all",
                  card: "bg-transparent shadow-none border-0",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                  socialButtonsBlockButton:
                    "neumorphic-button-sm bg-transparent text-[#718096] border-0 shadow-none hover:scale-105 active:scale-95 transition-all",
                  formFieldInput:
                    "neumorphic-card-inset bg-white border-0 shadow-none focus:ring-2 focus:ring-[#667eea] focus:ring-opacity-50",
                  footerActionLink: "text-[#667eea] hover:text-[#5a67d8]",
                },
              }}
            />
          </div>
          <div className="text-center">
            <a
              href="/reset-password"
              className="text-sm text-[#667eea] hover:text-[#5a67d8] transition-colors"
            >
              Lupa kata sandi?
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
