import { toInWindowBounds } from "@/libs/helpers/extensions/number";
import { useEffect, useRef } from "react";

interface TooltipProps {
  text: string;
  children: React.ReactNode;
}

export default function Tooltip({ text, children }: TooltipProps) {
  const childRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLSpanElement>(null);

  const mouseEnterEv = () => {
    if (childRef.current && tooltipRef.current) {
      const er = childRef.current.getBoundingClientRect();
      tooltipRef.current.style.transform = "scale(1)";
      tooltipRef.current.style.top = `${er.top - er.height - 2}px`;
      tooltipRef.current.style.left = `${toInWindowBounds(er.left, "x", tooltipRef.current, childRef.current)}px`;
      tooltipRef.current.style.opacity = "1";
    }
  };

  const mouseLeaveEv = () => {
    if (childRef.current && tooltipRef.current) {
      tooltipRef.current.style.transform = "scale(0.85)";
      tooltipRef.current.style.opacity = "0";
    }
  };

  useEffect(() => {
    childRef.current?.addEventListener("mouseenter", mouseEnterEv);
    childRef.current?.addEventListener("mouseleave", mouseLeaveEv);
    childRef.current?.addEventListener("mousedown", mouseLeaveEv);

    return () => {
      childRef.current?.removeEventListener("mouseenter", mouseEnterEv);
      childRef.current?.removeEventListener("mouseleave", mouseLeaveEv);
      childRef.current?.removeEventListener("mousedown", mouseLeaveEv);
    };
  });

  return (
    <>
      <div ref={childRef}>{children}</div>
      <span
        ref={tooltipRef}
        className="opacity-0 absolute top-[-35px] px-2 py-1 whitespace-nowrap bg-quaternary-200 rounded shadow transition-[transform,opacity] transition-opacity z-40"
      >
        {text}
      </span>
    </>
  );
}
