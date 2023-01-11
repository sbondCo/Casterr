/* eslint-disable @typescript-eslint/no-non-null-assertion */

import React from "react";
import { createRoot } from "react-dom/client";
import App from "./app/App";
import "./index.css";
import "@/common/common.scss";
import { registerAllBinds } from "./settings/keybind/keyBinds";

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

registerAllBinds();
