import { SignIn, useUser } from "@clerk/clerk-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Navigate } from "react-router-dom";

export default function Login() {
  const { isSignedIn } = useUser();

  if (isSignedIn) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="min-h-screen flex flex-col neumorphic-bg">
      <Navbar />
      <main className="flex-grow flex items-center justify-center">
        <SignIn
          path="/login"
          routing="path"
          signUpUrl="/signup"
          afterSignInUrl="/dashboard"
        />
        <div className="mt-4 text-center">
          <a href="/reset-password" className="text-sm text-blue-600">
            Lupa kata sandi?
          </a>
        </div>
      </main>
      <Footer />
    </div>
  );
}
