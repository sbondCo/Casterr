import { ProgressInfo, UpdateDownloadedEvent } from "electron-updater";
import { ipcRenderer } from "electron/renderer";
import React, { useEffect, useState } from "react";
import Icon from "./Icon";
import Spinner from "./Spinner";

export default function UpdateBar() {
  const [barMemo, setBarMemo] = useState<React.ReactElement>();
  const [spinner, setSpinner] = useState<boolean>(false);

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
    setSpinner(true);
  };

  const updateAvailable = () => {
    setBarMemo(<span>An update is available.. starting download.</span>);
    setSpinner(true);
  };

  const updateNotAvailable = () => {
    setBarMemo(<span>Casterr is up to date.</span>);
    setSpinner(false);
  };

  const progressing = (_: any, info: ProgressInfo) => {
    setBarMemo(<span>Update downloading: {info.percent.toFixed(2)}%</span>);
    setSpinner(true);
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
    setSpinner(false);
  };

  const error = () => {
    setBarMemo(
      <>
        <span>
          Failed to download update,{" "}
          <span
            className="underline font-bold cursor-pointer"
            onClick={() => {
              setBarMemo(<span>Retrying update check...</span>);
              setSpinner(true);
              ipcRenderer.send("update-check");
            }}
          >
            retry
          </span>
          .
        </span>
        <Icon
          i="close"
          wh={12}
          className="ml-auto cursor-pointer"
          onClick={() => {
            setBarMemo(undefined);
          }}
        />
      </>
    );
    setSpinner(false);
  };

  if (barMemo)
    return (
      <div className="flex items-center text-sm bg-secondary-100 pb-1 px-2 gap-2">
        {spinner ? <Spinner scale={0.25} /> : <></>}
        {barMemo}
      </div>
    );
  else return <></>;
}
