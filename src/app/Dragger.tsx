import Icon, { type Icons } from "@/common/Icon";
import { ipcRenderer } from "electron";

export default function Dragger() {
  return (
    <div
      className="flex flex-row-reverse h-4 bg-quaternary-100"
      style={{ WebkitAppRegion: "drag" } as React.CSSProperties}
    >
      <DraggerItem icon="close" />
      <DraggerItem icon="max" />
      <DraggerItem icon="min" />
    </div>
  );
}

function DraggerItem(props: { icon: Icons }) {
  const { icon } = props;

  const manageWindow = () => {
    ipcRenderer.send("manage-window", icon);
  };

  return (
    <div
      onClick={manageWindow}
      className={`flex justify-center items-center h-full w-8 fill-current text-white-100 cursor-pointer ${
        icon === "close" ? "hover:bg-red-100" : "hover:bg-white-50"
      }`}
      style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}
    >
      <Icon i={icon} wh={12} />
    </div>
  );
}
