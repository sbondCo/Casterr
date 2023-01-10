import { useEffect, useRef, useState } from "react";
import KeyBindKeys from "./KeyBindKeys";

interface KeyBindButtonProps {
  bind: string;
  onUpdate: (newBind: string) => void;
}

export default function KeyBindButton({ bind, onUpdate }: KeyBindButtonProps) {
  const [inEditMode, setInEditMode] = useState(false);
  const [newKeys, setNewKeys] = useState<string[]>([]);
  const btnRef = useRef<HTMLButtonElement>(null);
  const currentKeys = bind.split("+");

  useEffect(() => {
    const btn = btnRef.current;
    if (btn) {
      if (inEditMode) {
        btn.addEventListener("keydown", recordNewKeyBind);
        btn.addEventListener("blur", saveNewKeyBind);
      } else {
        btn.removeEventListener("keydown", recordNewKeyBind);
        btn.removeEventListener("blur", saveNewKeyBind);
        if (newKeys.length > 0) setNewKeys([]);
      }
    }

    return () => {
      btn?.removeEventListener("keydown", recordNewKeyBind);
      btn?.removeEventListener("blur", saveNewKeyBind);
    };
  }, [inEditMode, newKeys]);

  const recordNewKeyBind = (e: KeyboardEvent) => {
    console.log(e);

    if (e.key === "Backspace" && newKeys.length > 0) {
      setNewKeys([...newKeys.slice(0, -1)]);
      return;
    } else if (e.key === "Escape") {
      cancelNewKeyBind();
      return;
    } else if (e.key === "Enter") {
      e.preventDefault(); // Stop enter from casuing a btn click
      saveNewKeyBind();
      return;
    } else if (e.code === "Space") {
      e.preventDefault(); // Stop space from casuing a btn click
      return;
    }

    // Have this under utility keys ^ (so they still work) but above anything else.
    if (newKeys.length >= 4) return;

    let key = e.key;

    if (key.length === 1) key = key.toUpperCase();

    switch (e.key) {
      case "Control":
        key = "Ctrl";
        break;
    }

    setNewKeys([...newKeys, key]);
  };

  const cancelNewKeyBind = () => {
    setNewKeys([]);
    setInEditMode(false);
  };

  const saveNewKeyBind = () => {
    if (newKeys.length > 0) onUpdate(newKeys.join("+"));
    cancelNewKeyBind();
  };

  return (
    <button
      ref={btnRef}
      className="py-6 px-4 bg-secondary-100 rounded hover:bg-tertiary-100 transition"
      onClick={() => {
        setInEditMode(!inEditMode);
      }}
    >
      {!inEditMode ? (
        <KeyBindKeys keys={currentKeys} />
      ) : (
        <>{newKeys.length === 0 ? <span>Start Typing</span> : <KeyBindKeys keys={newKeys} />}</>
      )}
    </button>
  );
}
