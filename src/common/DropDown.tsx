import { useState } from "react";
import Icon from "./Icon";

interface DropDownProps {
  activeItem: DropDownItem | string | number;
  items: DropDownItem[] | string[] | number[];
  onChange: (selected: DropDownItem | string | number) => void;
}

export interface DropDownItem {
  /**
   * The dropdown component won't use this data
   * it is only returned back when the item is clicked.
   */
  id: any;

  /**
   * Display name.
   */
  name: string;
}

export default function DropDown({ activeItem, items, onChange }: DropDownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(activeItem);

  return (
    <div className="flex flex-col bg-secondary-100 rounded">
      <label
        className={`${
          isOpen ? "rounded-t" : "rounded"
        } flex items-center relative py-1.5 px-3 cursor-pointer hover:bg-tertiary-100 transition-colors`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{typeof selected === "object" ? selected.name : selected}</span>
        <Icon i="chevron" direction={isOpen ? "up" : "down"} wh={16} className="absolute right-3 fill-white-100" />
      </label>

      <ul className={`${!isOpen ? "max-h-0" : "max-h-36"} overflow-auto transition-all`}>
        {items.map((i, idx, { length }) => (
          <li
            key={idx}
            className={`${length - 1 === idx ? "rounded-b" : ""} ${
              i === selected ? "font-medium" : ""
            } py-1.5 px-3 cursor-pointer hover:bg-tertiary-100`}
            onClick={() => {
              setSelected(i);
              onChange(i);
              setIsOpen(false);
            }}
          >
            {typeof i === "object" ? i.name : i}
          </li>
        ))}
      </ul>
    </div>
  );
}
