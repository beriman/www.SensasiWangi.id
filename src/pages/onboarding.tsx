import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuthContext } from "@/providers/auth-provider";
import { supabase } from "@/lib/supabase";

export default function Onboarding() {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const createOrUpdateUser = useMutation(api.users.createOrUpdateUser);

  const [step, setStep] = useState(0);
  const initialName =
    (user?.user_metadata?.full_name as string | undefined) ||
    user?.user_metadata?.name ||
    "";
  const [displayName, setDisplayName] = useState(initialName);
  const [interests, setInterests] = useState("");
  const [location, setLocation] = useState("");
  const [role, setRole] = useState<"buyer" | "business">("buyer");

  const next = () => setStep((s) => s + 1);
  const back = () => setStep((s) => Math.max(0, s - 1));

  const handleFinish = async () => {
    await createOrUpdateUser({
      role,
      displayName,
      interests: interests
        .split(",")
        .map((i) => i.trim())
        .filter(Boolean),
      location,
    });
    if (user) {
      const parts = displayName.trim().split(" ");
      const firstName = parts.shift() || "";
      const lastName = parts.join(" ");
      await supabase.auth.updateUser({
        data: {
          full_name: displayName,
          first_name: firstName,
          last_name: lastName,
          role,
          interests,
          location,
        },
      });
    }
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col neumorphic-bg">
      <main className="flex-grow container mx-auto px-4 py-16">
        {step === 0 && (
          <div className="space-y-4 max-w-md mx-auto">
            <h1 className="text-2xl font-semibold text-center mb-4">
              Choose your display name
            </h1>
            <Input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
            <div className="flex justify-end">
              <Button onClick={next}>Next</Button>
            </div>
          </div>
        )}
        {step === 1 && (
          <div className="space-y-4 max-w-md mx-auto">
            <h1 className="text-2xl font-semibold text-center mb-4">
              Your fragrance interests
            </h1>
            <Input
              placeholder="e.g. floral, citrus"
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
            />
            <div className="flex justify-between">
              <Button variant="secondary" onClick={back}>
                Back
              </Button>
              <Button onClick={next}>Next</Button>
            </div>
          </div>
        )}
        {step === 2 && (
          <div className="space-y-4 max-w-md mx-auto">
            <h1 className="text-2xl font-semibold text-center mb-4">
              Location & Role
            </h1>
            <Input
              placeholder="Your city"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <div className="flex gap-4 py-2">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="buyer"
                  checked={role === "buyer"}
                  onChange={() => setRole("buyer")}
                />
                Buyer
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="business"
                  checked={role === "business"}
                  onChange={() => setRole("business")}
                />
                Business
              </label>
            </div>
            <div className="flex justify-between">
              <Button variant="secondary" onClick={back}>
                Back
              </Button>
              <Button onClick={handleFinish}>Finish</Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
