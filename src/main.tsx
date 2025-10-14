import { ConvexProvider, ConvexReactClient } from "convex/react";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { TempoDevtools } from "tempo-devtools";
import App from "./App.tsx";
import "./index.css";
import "./i18n";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import { AuthProvider } from "./providers/auth-provider";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

TempoDevtools.init();

const basename = import.meta.env.BASE_URL;

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/service-worker.js").catch(console.error);
  });
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ConvexProvider client={convex}>
      <AuthProvider>
        <I18nextProvider i18n={i18n}>
          <BrowserRouter basename={basename}>
            <App />
          </BrowserRouter>
        </I18nextProvider>
      </AuthProvider>
    </ConvexProvider>
  </React.StrictMode>,
);
