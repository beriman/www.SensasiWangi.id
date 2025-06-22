import { SignIn } from "@clerk/clerk-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function ResetPassword() {
  return (
    <div className="min-h-screen flex flex-col neumorphic-bg">
      <Navbar />
      <main className="flex-grow flex items-center justify-center">
        <SignIn path="/reset-password" routing="path" initialState="forgotPassword" />
      </main>
      <Footer />
    </div>
  );
}
