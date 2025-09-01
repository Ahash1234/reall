import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./lib/firebase"; // Import Firebase initialization
import "./lib/i18n"; // Import i18n initialization

createRoot(document.getElementById("root")!).render(<App />);
