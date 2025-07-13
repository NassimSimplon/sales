import "./index.css";
import App from "./App.tsx";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
// If you want to start measuring performance in your app, pass a function  