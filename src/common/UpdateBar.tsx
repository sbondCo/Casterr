import { ProgressInfo, UpdateDownloadedEvent } from "electron-updater";
import { ipcRenderer } from "electron/renderer";
import React, { useEffect, useState } from "react";

export default function UpdateBar() {
  const [barMemo, setBarMemo] = useState<React.ReactElement>();

  useEffect(() => {
    ipcRenderer.on("checking-for-update", checkingForUpdate);
    ipcRenderer.on("update-available", updateAvailable);
    ipcRenderer.on("update-not-available", updateNotAvailable);
    ipcRenderer.on("update-download-progress", progressing);
    ipcRenderer.on("update-downloaded", downloaded);
    ipcRenderer.on("update-error", error);

    return () => {
      ipcRenderer.off("checking-for-update", checkingForUpdate);
      ipcRenderer.off("update-available", updateAvailable);
      ipcRenderer.off("update-not-available", updateNotAvailable);
      ipcRenderer.off("update-download-progress", progressing);
      ipcRenderer.off("update-downloaded", downloaded);
      ipcRenderer.off("update-error", error);
    };
  });

  const checkingForUpdate = () => {
    setBarMemo(<span>Checking for updates...</span>);
  };

  const updateAvailable = () => {
    setBarMemo(<span>An update is available.. starting download.</span>);
  };

  const updateNotAvailable = () => {
    setBarMemo(<span>Casterr is up to date.</span>);
  };

  const progressing = (_: any, info: ProgressInfo) => {
    setBarMemo(<span>Update downloading: {info.percent.toFixed(2)}%</span>);
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

  if (barMemo) return <div className="text-sm bg-secondary-100 px-3 pb-1">{barMemo}</div>;
  else return <></>;
}
