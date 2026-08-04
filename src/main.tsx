import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/styles/globals.css";
import App from "@/app/App";
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorFallback } from "./components/ErrorBoundry/ErrorFallback";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, info) => {
        console.error("Error:", error);
        console.error("Info:", info);
      }}
      onReset={() => {
        window.location.reload();
      }}
    >
      <App />
    </ErrorBoundary>
  </StrictMode>
);
