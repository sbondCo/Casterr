import React from "react";

interface KeyBindKeysProps {
  keys: string[];
}

export default function KeyBindKeys({ keys }: KeyBindKeysProps) {
  return (
    <>
      {keys.map((k, i) => (
        <React.Fragment key={i}>
          <span className="p-3 bg-quaternary-100 rounded">{k}</span>
          {i + 1 !== keys.length ? <span className="mx-3 font-bold">+</span> : null}
        </React.Fragment>
      ))}
    </>
  );
}
