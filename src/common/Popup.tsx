import { PopupOptions } from "@/libs/helpers/notifications";
import { useState } from "react";
import Button from "./Button";
import Icon from "./Icon";
import Loader from "./Loader";
import Progress from "./Progress";
import TickBox from "./TickBox";

interface PopupProps extends PopupOptions {
  tickBoxesChecked?: string[];
}

export default function Popup(props: PopupProps) {
  const { title, percentage, loader, showCancel = false, buttons, tickBoxes, tickBoxesChecked } = props;

  const [tbc, setTbc] = useState<string[]>([]);

  return (
    <div className="flex flex-col gap-5 justify-center items-center relative min-w-[500px] min-h-[150px] px-4 py-5 bg-quaternary-100 rounded-xl">
      {showCancel && (
        <Icon
          className="absolute top-3 right-3 text-white-100 transition-all cursor-pointer hover:text-white-50"
          i="close"
          wh={16}
          onClick={() => console.log("p")}
        />
      )}
      <span className="p-1.5 text-xl font-bold capitalize">{title}</span>

      {loader && <Loader />}
      {percentage && <Progress p={percentage} />}

      {tickBoxes && tickBoxes.length > 0 && (
        <div className="flex flex-col gap-3 justify-center">
          {tickBoxes.map((t) => (
            <div key={t.name} className="flex gap-3">
              <TickBox
                ticked={tbc.includes(t.name)}
                onChange={(ticked) => {
                  if (ticked) setTbc([...tbc, t.name]);
                  else setTbc(tbc.filter((e) => e !== t.name));
                }}
              />
              <span className="">{t.name}</span>
            </div>
          ))}
        </div>
      )}

      {buttons && buttons.length > 0 && (
        <div className="flex flex-row gap-3 justify-center items-center">
          {buttons.map((b) => (
            <Button key={b} text={b} />
          ))}
        </div>
      )}
    </div>
  );
}
