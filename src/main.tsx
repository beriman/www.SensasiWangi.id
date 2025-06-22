import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { TempoDevtools } from "tempo-devtools";
import App from "./App.tsx";
import "./index.css";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

TempoDevtools.init();

const basename = import.meta.env.BASE_URL;

// Import your P Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      afterSignOutUrl="/"
      signInUrl="/login"
      signUpUrl="/signup"
      appearance={{
        baseTheme: undefined,
        variables: {
          colorPrimary: "#667eea",
          colorBackground: "#e0e5ec",
          colorInputBackground: "#ffffff",
          colorInputText: "#2d3748",
          borderRadius: "16px",
        },
      }}
      localization={{
        signIn: {
          start: {
            title: "Masuk ke Akun Anda",
            subtitle: "Selamat datang kembali! Silakan masuk ke akun Anda.",
          },
        },
        signUp: {
          start: {
            title: "Buat Akun Baru",
            subtitle: "Bergabunglah dengan komunitas parfum enthusiast kami.",
          },
        },
      }}
    >
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <BrowserRouter basename={basename}>
          <App />
        </BrowserRouter>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  </React.StrictMode>,
);
