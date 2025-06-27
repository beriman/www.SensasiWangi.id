import { SignUp } from "@clerk/clerk-react";

export default function Signup() {
  return (
    <div className="min-h-screen flex flex-col neumorphic-bg">
      <main className="flex-grow flex items-center justify-center">
        <SignUp path="/signup" routing="path" signInUrl="/login" afterSignUpUrl="/onboarding" />
      </main>
    </div>
  );
}
