import Icon from "@/common/Icon";
const { ipcRenderer } = require("electron");

export default function Dragger() {
  return (
    <div className="flex flex-row-reverse h-4 bg-primary-100">
      <DraggerItem icon="close" hoverColor="red-100" />
      <DraggerItem icon="max" />
      <DraggerItem icon="min" />
    </div>
  );
}

function DraggerItem(props: { icon: string; hoverColor?: string }) {
  const { icon, hoverColor = "white-50" } = props;

  const manageWindow = () => {
    ipcRenderer.send("manage-window", icon);
  };

  return (
    <div
      onClick={manageWindow}
      className={`flex justify-center items-center h-full w-8 fill-current text-white-100 hover:bg-${hoverColor}`}
    >
      <Icon i={icon} wh={12} />
    </div>
  );
}
