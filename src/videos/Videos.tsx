import Icon from "@/common/Icon";
import PageLayout from "@/common/PageLayout";
import SubNav, { SubNavItem } from "@/common/SubNav";
import RecordingsManager from "@/libs/recorder/recordingsManager";
import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import VideosGrid from "./VideosGrid";

export default function Videos() {
  const [dropZoneShown, setDropZoneShown] = useState(false);
  const [dropZoneFLen, setDropZoneFLen] = useState<number>();
  let dragEnterTarget: EventTarget;

  const addDroppedVideo = (ev: React.DragEvent) => {
    ev.preventDefault();
    ev.stopPropagation();

    setDropZoneShown(false);

    // Add dropped files to recordings
    if (ev.dataTransfer != null) {
      for (var i = 0; i < ev.dataTransfer.items.length; i++) {
        const item = ev.dataTransfer.items[i];
        const video = item.getAsFile();

        // Only add to recordings if the file is a video
        if (item.kind === "file" && item.type.includes("video") && video) {
          console.log("Adding dropped video:", video);
          RecordingsManager.add(video.path);
        }
      }
    }
  };

  const handleVideoDragOver = (ev: React.DragEvent) => {
    // Prevent default behavior so out drop event will work.
    ev.preventDefault();
    ev.stopPropagation();
  };

  const handleVideoDragEnter = (ev: React.DragEvent) => {
    ev.preventDefault();
    ev.stopPropagation();

    dragEnterTarget = ev.target;
    setDropZoneShown(true);

    if (ev.dataTransfer != null && ev.dataTransfer.items.length > 0 && ev.dataTransfer.items[0]) {
      setDropZoneFLen(ev.dataTransfer.items.length);
    }
  };

  const handleVideoDragLeave = (ev: React.DragEvent) => {
    ev.preventDefault();
    ev.stopPropagation();

    // Only act as if drag has actually ended
    // if dragEnterTarget is the same as event.target.
    if (dragEnterTarget == ev.target) {
      setDropZoneShown(false);
    }
  };

  return (
    <PageLayout smPageWidth={false}>
      <div
        onDrop={addDroppedVideo}
        onDragOver={handleVideoDragOver}
        onDragEnter={handleVideoDragEnter}
        onDragLeave={handleVideoDragLeave}
      >
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
