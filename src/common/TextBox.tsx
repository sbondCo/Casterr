import useDebouncer from "@/hooks/useDebouncer";
import { logger } from "@/libs/logger";
import { ipcRenderer } from "electron";
import { useState } from "react";
import Icon, { type Icons } from "./Icon";
import { type CommonComponentProps } from "./types";

type TextBoxProps = {
  value: string | number;
  placeholder: string | number;
  icon?: Icons;

  /**
   * With this unset, we call the onChange callback when
   * onBlur is called.
   *
   * With this set (to a number as milliseconds) we will
   * debounce the onChange callback to whatever is passed.
   *
   * @example If we pass 250, we will only call the onChange
   * callback 250ms after the last change.
   */
  debounce?: number;
} & (
  | {
      type?: "text";
      folderSelect?: boolean;
      onChange: (newValue: string) => void;
    }
  | {
      type: "number";
      folderSelect?: false;
      onChange: (newValue: number) => void;
    }
) &
  CommonComponentProps;

export default function TextBox(props: TextBoxProps) {
  const { value, placeholder, type, folderSelect = false, onChange, debounce, className, icon } = props;

  const { doDebounce } = useDebouncer(debounce);
  const [curVal, setCurVal] = useState(value);

  // newVal param set as string becuase we get input value
  // from onBlur event (e.target.value), which returns as only string.
  // So no point having union type to include numbers as well.
  const callOnChangeCallback = (newVal: string) => {
    if (type === "number") onChange(Number(newVal));
    else onChange(newVal);
  };

  const selectFolder = () => {
    ipcRenderer
      .invoke("show-open-dialog", {
        title: `Select save folder`,
        defaultPath: curVal,
        buttonLabel: "Select",
        properties: ["openDirectory"]
      })
      .then((r: Electron.OpenDialogReturnValue) => {
        if (r.canceled) return;

        // If a folder was selected, set textBox value to it
        const folder = r.filePaths[0];
        if (folder != null) {
          setCurVal(folder);
          callOnChangeCallback(folder);
        }
      })
      .catch((e) => {
        logger.error("textbox", "show-open-dialog call failed!", e);
      });
  };

  return (
    <div className={`flex flex-row rounded border-separate overflow-hidden relative ${className ?? ""}`}>
      <input
        value={curVal}
        type={type}
        placeholder={String(placeholder)}
        onChange={(e) => {
          setCurVal(e.target.value);

          if (debounce !== undefined) {
            doDebounce(() => {
              callOnChangeCallback(e.target.value);
            });
          }
        }}
        onBlur={(e) => {
          if (debounce) return;
          callOnChangeCallback(e.target.value);
        }}
        className={`h-full w-full py-1.5 px-3 bg-secondary-100 hover:bg-tertiary-100 transition-colors ${
          icon ? "pr-9" : ""
        }`}
      />

      {icon && <Icon className="absolute top-[5px] right-2 pointer-events-none" i={icon} wh={22} />}

      {folderSelect && (
        <button
          className="flex items-center px-3 bg-quaternary-100 hover:bg-tertiary-100 transition-colors"
          onClick={() => {
            selectFolder();
          }}
        >
          Select
        </button>
      )}
    </div>
  );
}
