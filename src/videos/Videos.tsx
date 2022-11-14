import Icon from "@/common/Icon";
import PageLayout from "@/common/PageLayout";
import SubNav, { SubNavItem } from "@/common/SubNav";
import useDragAndDrop from "@/hooks/useDragAndDrop";
import RecordingsManager from "@/libs/recorder/recordingsManager";
import { useRef } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import VideosGrid from "./VideosGrid";

export default function Videos() {
  let pageRef = useRef<HTMLDivElement>(null);
  const { dropZoneShown, dropZoneFLen } = useDragAndDrop(pageRef, (f: File) => {
    if (f.type.includes("video")) {
      // TODO when on `clips` sub page, add dropped videos as clips
      RecordingsManager.add(f.path);
    }
  });

  return (
    <PageLayout smPageWidth={false}>
      <div ref={pageRef}>
        {dropZoneShown && (
          <div className="flex gap-1 flex-col items-center translate-x-[-50%] left-[50%] top-1/2 fixed px-5 py-3 bg-quaternary-200 bg-opacity-80 text-xl font-bold rounded border-4 border-white-100 border-dashed z-50">
            <div className="flex gap-5 flex-row items-center ">
              <Icon i="add" wh={36} />
              <span>Add Video{dropZoneFLen && dropZoneFLen > 1 ? "s" : ""}</span>
            </div>
            {dropZoneFLen && (
              <span className="text-sm">
                Drop to add {dropZoneFLen} video{dropZoneFLen && dropZoneFLen > 1 ? "s" : ""}.
              </span>
            )}
          </div>
        )}

        <SubNav>
          <SubNavItem text="Recordings" />
          <SubNavItem text="Clips" />
        </SubNav>

        <Routes>
          <Route path="" element={<Navigate replace to="recordings" />} />
          <Route path="recordings" element={<VideosGrid type="recordings" />} />
          <Route path="clips" element={<VideosGrid type="clips" />} />
        </Routes>
      </div>
    </PageLayout>
  );
}
