import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Ensure the root element exists before rendering
const rootElement = document.getElementById("root");

if (!rootElement) {
  console.error("❌ Root element not found! The HTML template may be corrupted.");
  document.body.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: center; height: 100vh; font-family: system-ui;">
      <div style="text-align: center; padding: 2rem; border: 1px solid #e2e8f0; border-radius: 8px; background: #f8fafc;">
        <h1 style="color: #dc2626; margin-bottom: 1rem;">Application Error</h1>
        <p style="color: #64748b; margin-bottom: 1rem;">Failed to initialize the application.</p>
        <button onclick="window.location.reload()" style="padding: 0.5rem 1rem; background: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer;">
          Reload Page
        </button>
      </div>
    </div>
  `;
} else {
  try {
    const root = createRoot(rootElement);
    root.render(<App />);
  } catch (error) {
    console.error("❌ Failed to render React app:", error);
    rootElement.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: center; height: 100vh; font-family: system-ui;">
        <div style="text-align: center; padding: 2rem; border: 1px solid #e2e8f0; border-radius: 8px; background: #f8fafc;">
          <h1 style="color: #dc2626; margin-bottom: 1rem;">Render Error</h1>
          <p style="color: #64748b; margin-bottom: 1rem;">Failed to render the React application.</p>
          <details style="margin-bottom: 1rem; text-align: left;">
            <summary style="cursor: pointer; color: #64748b;">Error Details</summary>
            <pre style="font-size: 12px; color: #dc2626; margin-top: 0.5rem; overflow: auto;">${error}</pre>
          </details>
          <button onclick="window.location.reload()" style="padding: 0.5rem 1rem; background: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer;">
            Reload Page
          </button>
        </div>
      </div>
    `;
  }
}
