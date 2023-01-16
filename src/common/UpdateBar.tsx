import { ProgressInfo, UpdateDownloadedEvent } from "electron-updater";
import { ipcRenderer } from "electron/renderer";
import React, { useEffect, useState } from "react";

export default function UpdateBar() {
  const [barMemo, setBarMemo] = useState<React.ReactElement>();

  useEffect(() => {
    const progressing = (_: any, info: ProgressInfo) => {
      setBarMemo(<span>Updating downloading: {info.percent.toFixed(2)}</span>);
    };

    const downloaded = (_: any, info: UpdateDownloadedEvent) => {
      setBarMemo(
        <span>
          Version {info.version} downloaded,{" "}
          <span className="underline font-bold cursor-pointer" onClick={() => ipcRenderer.send("install-update")}>
            install now
          </span>
          .
        </span>
      );
    };

    const error = () => {
      setBarMemo(
        <span>
          Failed to download update,{" "}
          <span
            className="underline font-bold cursor-pointer"
            onClick={() => {
              setBarMemo(<span>Retrying update check...</span>);
              ipcRenderer.send("update-check");
            }}
          >
            retry
          </span>
          .
        </span>
      );
    };

    ipcRenderer.on("update-download-progress", progressing);
    ipcRenderer.on("update-downloaded", downloaded);
    ipcRenderer.on("update-error", error);

    return () => {
      ipcRenderer.off("update-download-progress", progressing);
      ipcRenderer.off("update-downloaded", downloaded);
      ipcRenderer.on("update-error", error);
    };
  });

  if (barMemo) return <div className="text-sm bg-secondary-100 px-3 pb-1">{barMemo}</div>;
  else return <></>;
}
