import { useParams } from "react-router-dom";
import Icon, { Icons } from "./Icon";

export default function DesktopNotification() {
  const { icon, desc } = useParams<{ icon: Icons; desc: string }>();

  return (
    <div className="flex flex-row items-center justify-center h-screen w-screen gap-4 rounded-xl border-[5px] border-quaternary-100 select-none">
      {icon && <Icon i={icon} wh={35} />}
      <span className="text-2xl font-medium">{desc}</span>
    </div>
  );
}
