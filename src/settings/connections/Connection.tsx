import Button from "@/common/Button";
import Icon, { type Icons } from "@/common/Icon";
import Tooltip from "@/common/Tooltip";
import { useEffect, useState } from "react";

interface ConnectionProps {
  /**
   * Name of connection to show.
   */
  name: string;

  /**
   * Connection icon. Service logo.
   */
  icon: Icons;

  /**
   * Undefined = not connected
   * True (bool) = Connected
   * String = Connected, but show username too
   */
  connected?: true | string;

  /**
   * On service connect clicked.
   */
  onConnectClick: () => void;
}

export default function Connection({ name, icon, connected, onConnectClick }: ConnectionProps) {
  const [connectedMsg, setConnectedMsg] = useState("Not Connected");

  useEffect(() => {
    if (connected === true) {
      setConnectedMsg("Connected");
    } else if (typeof connected === "string") {
      setConnectedMsg(`Connected as ${connected}`);
    } else {
      useState("Not Connected");
    }
  }, [connected]);

  return (
    <button
      onClick={!connected ? onConnectClick : undefined}
      className="flex items-center gap-3 w-full px-3 py-2 bg-secondary-100 rounded-lg cursor-pointer transition hover:bg-tertiary-100"
    >
      <Icon i={icon} wh={38} />
      <div className="flex flex-col items-start">
        <span>{name}</span>
        <span className="text-xs">{connectedMsg}</span>
      </div>
      {connected && (
        <Tooltip text="Disconnect" className="ml-auto" gap={22}>
          <Icon i="close" wh={16} />
        </Tooltip>
      )}
    </button>
  );
}
