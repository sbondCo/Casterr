import PageLayout from "@/common/PageLayout";
import SubNav, { SubNavItem } from "@/common/SubNav";
import { Routes, Route, Navigate } from "react-router-dom";
import VideosGrid from "./VideosGrid";

export default function Videos() {
  return (
    <PageLayout smPageWidth={false}>
      <SubNav>
        <SubNavItem text="Recordings" />
        <SubNavItem text="Clips" />
      </SubNav>

      <Routes>
        <Route path="" element={<Navigate replace to="recordings" />} />
        <Route path="recordings" element={<VideosGrid type="recordings" />} />
        <Route path="clips" element={<VideosGrid type="clips" />} />
      </Routes>
    </PageLayout>
  );
}
