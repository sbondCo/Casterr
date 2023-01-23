import Button from "@/common/Button";
import Paths from "@/libs/helpers/paths";
import { logger } from "@/libs/logger";
import { ipcRenderer, shell } from "electron";
import { useEffect, useState } from "react";

export default function About() {
  const [version, setVersion] = useState();
  const versions = process.versions;

  useEffect(() => {
    ipcRenderer
      .invoke("get-version")
      .then((v) => {
        setVersion(v);
      })
      .catch((err) => logger.error("About", "Failed to get version info:", err));
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col">
        <span>Casterr: {version}</span>
        <span>Node: {versions.node}</span>
        <span>Electron: {versions.electron}</span>
      </div>

      <div className="flex flex-row gap-3">
        <Button text="Update Check" onClick={() => ipcRenderer.send("update-check")} />
        <Button text="View Logs" onClick={async () => await shell.openPath(Paths.logsPath)} />
        <Button
          text="Open GitHub Repo"
          onClick={async () => await shell.openExternal("https://github.com/sbondCo/Casterr")}
          outlined={true}
        />
        <Button
          text="Open Website"
          onClick={async () => await shell.openExternal("https://casterr.sbond.co")}
          outlined={true}
        />
      </div>
    </div>
  );
}
