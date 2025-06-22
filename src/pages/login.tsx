import { SignIn } from "@clerk/clerk-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function Login() {
  return (
    <div className="min-h-screen flex flex-col neumorphic-bg">
      <Navbar />
      <main className="flex-grow flex items-center justify-center">
        <SignIn path="/login" routing="path" signUpUrl="/signup" afterSignInUrl="/dashboard" />
      </main>
      <Footer />
    </div>
  );
}
