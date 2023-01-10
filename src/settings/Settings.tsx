import PageLayout from "@/common/PageLayout";
import SubNav, { SubNavItem } from "@/common/SubNav";
import { Routes, Route, Navigate } from "react-router";
import General from "./pages/General";
import KeyBindings from "./keybind/KeyBindings";
import Recording from "./pages/Recording";

export default function Settings() {
  return (
    <PageLayout>
      <SubNav>
        <SubNavItem text="General" />
        <SubNavItem text="Recording" />
        <SubNavItem text="Key Bindings" />
      </SubNav>

      <Routes>
        {/* Redirect to general settings - the default */}
        <Route path="" element={<Navigate replace to="general" />} />
        <Route path="general" element={<General />} />
        <Route path="recording" element={<Recording />} />
        <Route path="keybindings" element={<KeyBindings />} />
      </Routes>
    </PageLayout>
  );
}
