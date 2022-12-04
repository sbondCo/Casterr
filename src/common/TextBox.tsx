import { ipcRenderer } from "electron";
import { useState } from "react";
import { CommonComponentProps } from "./types";

type TextBoxProps = {
  value: string | number;
  placeholder: string | number;
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
  const { value, placeholder, type, folderSelect = false, onChange, className } = props;

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
        console.error("show-open-dialog call failed!", e);
      });
  };

  return (
    <div className={`flex flex-row rounded border-separate overflow-hidden ${className ?? ""}`}>
      <input
        value={curVal}
        type={type}
        placeholder={String(placeholder)}
        onChange={(e) => setCurVal(e.target.value)}
        onBlur={(e) => callOnChangeCallback(e.target.value)}
        className="h-full w-full py-1.5 px-3 bg-secondary-100 hover:bg-tertiary-100 transition-colors"
      />

      {folderSelect && (
        <button
          className="flex items-center px-3 bg-quaternary-100 hover:bg-tertiary-100 transition-colors"
          onClick={() => selectFolder()}
        >
          Select
        </button>
      )}
    </div>
  );
}
