import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import App from "./App.tsx";
import { AuthProvider } from "./context/AuthProvider";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import resources from "@/common/i18n";

import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@/components/shadcn/theme-provider";
import ThemeBar from "@/components/ThemeBar";

// --- Initialisation de i18next ---
i18n.use(initReactI18next).init({
  resources,
  lng: "fr",
  fallbackLng: "fr",
  interpolation: {
    escapeValue: false,
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* Ajout du router ici */}
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
          <ThemeBar />
          <App />
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
