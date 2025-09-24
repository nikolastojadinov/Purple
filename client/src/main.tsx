import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import PiSdkCheck from "@/components/pi/pi-sdk-check";

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <PiSdkCheck>
      <App />
    </PiSdkCheck>
  </ErrorBoundary>
);
