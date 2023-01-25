import { logger } from "@/libs/logger";
import { useEffect, useRef, useState } from "react";
import KeyBindKeys from "./KeyBindKeys";
import { updateBind } from "./keyBinds";

interface KeyBindButtonProps {
  name: string;
  bind: string;
  onUpdate: (newBind: string) => void;
}

export default function KeyBindButton({ name, bind, onUpdate }: KeyBindButtonProps) {
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
    e.preventDefault();

    if (e.key === "Backspace" && newKeys.length > 0) {
      setNewKeys([...newKeys.slice(0, -1)]);
      return;
    } else if (e.key === "Escape") {
      cancelNewKeyBind();
      return;
    } else if (e.key === "Enter") {
      saveNewKeyBind();
      return;
    }

    // Have this under utility keys ^ (so they still work) but above anything else.
    if (newKeys.length >= 4) return;

    let key = e.key;

    // If one length, probs a letter so just upper case it
    if (key.length === 1) key = key.toUpperCase();

    switch (e.key) {
      case "Control":
        key = "Ctrl";
        break;
      case " ":
        key = "Space";
        break;
    }

    setNewKeys([...newKeys, key]);
  };

  const cancelNewKeyBind = () => {
    setNewKeys([]);
    setInEditMode(false);
  };

  const saveNewKeyBind = () => {
    if (newKeys.length > 0) {
      const flashBtn = (success: boolean) => {
        const colorClass = success ? "!bg-green-100" : "!bg-red-100";
        btnRef.current?.classList.add(colorClass);
        setTimeout(() => {
          btnRef.current?.classList.remove(colorClass);
        }, 250);
      };

      updateBind(name, newKeys.join("+"), bind)
        .then((success) => {
          if (success) {
            onUpdate(newKeys.join("+"));
          }

          flashBtn(success);
        })
        .catch((err) => {
          logger.error("KeyBindButton", "Error saving new keybind!", err);
          flashBtn(false);
        });
    }

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
