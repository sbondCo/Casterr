import Icon from "@/common/Icon";
import React from "react";

export default function Dragger() {
  return (
    <div
      className="flex flex-row-reverse h-4 bg-primary-100"
      style={{ WebkitAppRegion: "drag" } as React.CSSProperties}
    >
      <DraggerItem icon="close" hoverColor="red-100" />
      <DraggerItem icon="max" />
      <DraggerItem icon="min" />
    </div>
  );
}

function DraggerItem(props: { icon: string; hoverColor?: string }) {
  const { icon, hoverColor = "white-50" } = props;

  const manageWindow = () => {
    window.api.send("manage-window", icon);
  };

  return (
    <div
      onClick={manageWindow}
      className={`flex justify-center items-center h-full w-8 fill-current text-white-100 hover:bg-${hoverColor}`}
      style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}
    >
      <Icon i={icon} wh={12} />
    </div>
  );
}
