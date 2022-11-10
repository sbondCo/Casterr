import React from "react";
import { createRoot } from "react-dom/client";
import App from "./app/App";
import "./index.css";
import "@/common/common.scss";

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
