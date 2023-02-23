import { type PopupOptions } from "@/libs/helpers/notifications";
import { useState } from "react";
import Button from "./Button";
import Icon from "./Icon";
import Loader from "./Loader";
import Progress from "./Progress";
import TickBox from "./TickBox";

export default function Popup(props: PopupOptions) {
  const { title, percentage, loader, showCancel = false, buttons, tickBoxes, message } = props;

  const [tbc, setTbc] = useState<string[]>(
    tickBoxes
      ? tickBoxes.flatMap((t) => {
          if (t.ticked) return t.name;
          return [];
        })
      : []
  );

  const elClicked = (el: string) => {
    document.dispatchEvent(
      new CustomEvent(`${props.id}-el-clicked`, {
        detail: { elClicked: el, tickBoxesChecked: tbc }
      })
    );
  };

  return (
    <div
      id={`${props.id}`}
      className="flex flex-col gap-5 justify-center items-center relative min-w-[500px] min-h-[150px] px-4 py-5 bg-quaternary-100 rounded-xl"
    >
      {showCancel && (
        <Icon
          className="absolute top-3 right-3 text-white-100 cursor-pointer hover:text-white-50"
          i="close"
          wh={16}
          onClick={() => {
            elClicked("cancel");
          }}
        />
      )}
      <span className="p-1 text-xl font-bold capitalize">{title}</span>

      {message && <span>{message}</span>}
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
            <Button
              key={b}
              text={b}
              onClick={() => {
                elClicked(b);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
