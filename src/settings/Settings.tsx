import PageLayout from "@/common/PageLayout";
import SubNav, { SubNavItem } from "@/common/SubNav";
import { Routes, Route, Navigate } from "react-router";
import General from "./pages/General";
import KeyBindings from "./keybind/KeyBindings";
import Recording from "./pages/Recording";
import About from "./pages/About";
import Connections from "./connections/Connections";

export default function Settings() {
  return (
    <PageLayout>
      <SubNav>
        <SubNavItem icon="globe" text="General" />
        <SubNavItem icon="clips" text="Recording" />
        <SubNavItem icon="pin" text="Key Bindings" />
        <SubNavItem icon="wifi" text="Connections" />
        <SubNavItem icon="info" text="About" />
      </SubNav>

      <Routes>
        {/* Redirect to general settings - the default */}
        <Route path="" element={<Navigate replace to="general" />} />
        <Route path="general" element={<General />} />
        <Route path="recording" element={<Recording />} />
        <Route path="keybindings" element={<KeyBindings />} />
        <Route path="connections" element={<Connections />} />
        <Route path="about" element={<About />} />
      </Routes>
    </PageLayout>
  );
}
