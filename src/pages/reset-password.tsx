import { SignIn } from "@clerk/clerk-react";

export default function ResetPassword() {
  return (
    <div className="min-h-screen flex flex-col neumorphic-bg">
      <main className="flex-grow flex items-center justify-center">
        <SignIn path="/reset-password" routing="path" />
      </main>
    </div>
  );
}
