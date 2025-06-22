import { SignUp } from "@clerk/clerk-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function Signup() {
  return (
    <div className="min-h-screen flex flex-col neumorphic-bg">
      <Navbar />
      <main className="flex-grow flex items-center justify-center">
        <SignUp path="/signup" routing="path" signInUrl="/login" afterSignUpUrl="/dashboard" />
      </main>
      <Footer />
    </div>
  );
}
