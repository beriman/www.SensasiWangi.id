import { useMemo } from "react";
import { useAuthContext } from "@/providers/auth-provider";
import { supabase } from "@/lib/supabase";

interface EmailAddressResource {
  emailAddress: string;
}

interface ClerkLikeUser {
  id: string;
  fullName: string | null;
  primaryEmailAddress: EmailAddressResource | null;
  emailAddresses: EmailAddressResource[];
  imageUrl: string | null;
  publicMetadata: Record<string, unknown>;
  unsafeMetadata: Record<string, unknown>;
  username: string | null;
  update: (attributes: Record<string, unknown>) => Promise<void>;
}

export function useUser() {
  const { user, isLoading } = useAuthContext();

  const mappedUser = useMemo<ClerkLikeUser | null>(() => {
    if (!user) {
      return null;
    }

    const email = user.email ?? "";
    const metadata = user.user_metadata ?? {};

    return {
      id: user.id,
      fullName: (metadata.full_name as string | undefined) ?? null,
      primaryEmailAddress: email ? { emailAddress: email } : null,
      emailAddresses: email ? [{ emailAddress: email }] : [],
      imageUrl: (metadata.avatar_url as string | undefined) ?? null,
      publicMetadata: metadata,
      unsafeMetadata: metadata,
      username: (metadata.username as string | undefined) ?? null,
      update: async (attributes: Record<string, unknown>) => {
        const data: Record<string, unknown> = {};

        if ("firstName" in attributes || "lastName" in attributes) {
          const firstName = (attributes.firstName as string | undefined) ?? (metadata.first_name as string | undefined) ?? "";
          const lastName = (attributes.lastName as string | undefined) ?? (metadata.last_name as string | undefined) ?? "";
          data.first_name = firstName;
          data.last_name = lastName;
          data.full_name = [firstName, lastName].filter(Boolean).join(" ").trim();
        }

        if ("username" in attributes) {
          data.username = attributes.username;
        }

        const otherKeys = Object.keys(attributes).filter(
          (key) => !["firstName", "lastName", "username"].includes(key),
        );
        for (const key of otherKeys) {
          data[key] = attributes[key];
        }

        if (Object.keys(data).length > 0) {
          await supabase.auth.updateUser({ data });
        }
      },
    };
  }, [user]);

  return {
    isLoaded: !isLoading,
    isSignedIn: Boolean(mappedUser),
    user: mappedUser,
  };
}

export type { ClerkLikeUser as UserResource };
