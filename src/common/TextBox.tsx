import { useState } from "react";

type TextBoxProps = {
  value: string | number;
  placeholder: string | number;
  folderSelect?: boolean;
} & (
  | {
      type?: "text";
      onChange: (newValue: string) => void;
    }
  | {
      type: "number";
      onChange: (newValue: number) => void;
    }
);

export default function TextBox(props: TextBoxProps) {
  const { value, placeholder, type, folderSelect = false, onChange } = props;

  const [curVal, setCurVal] = useState(value);

  return (
    <div className="flex flex-col">
      <input
        value={curVal}
        type={type}
        placeholder={String(placeholder)}
        onChange={(e) => setCurVal(e.target.value)}
        onBlur={(e) => {
          if (type === "text") onChange(e.target.value);
          else if (type === "number") onChange(Number(e.target.value));
        }}
        className="h-8 py-1.5 px-3 bg-secondary-100 rounded"
      />
    </div>
  );
}
