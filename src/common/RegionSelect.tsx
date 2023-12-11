import { ipcRenderer } from "electron";
import { useEffect, useRef } from "react";

export default function RegionSelect() {
  const dRef = useRef<HTMLDivElement>(null);
  let startX: number;
  let startY: number;
  let isDrawing = false;
  let regionDiv: HTMLDivElement;

  useEffect(() => {
    if (dRef?.current) {
      dRef.current.addEventListener("mousedown", startDraw);
      dRef.current.addEventListener("mousemove", doDraw);
      dRef.current.addEventListener("mouseup", stopDraw);

      return () => {
        dRef.current?.removeEventListener("mousedown", startDraw);
        dRef.current?.removeEventListener("mousemove", doDraw);
        dRef.current?.removeEventListener("mouseup", stopDraw);
      };
    }
  }, []);

  function startDraw(ev: MouseEvent) {
    console.log("startDraw");
    regionDiv = document.createElement("div");
    regionDiv.style.backgroundColor = "transparent";
    regionDiv.style.border = "2px dashed white";
    startX = ev.clientX;
    startY = ev.clientY;
    regionDiv.style.left = `${ev.clientX}px`;
    regionDiv.style.top = `${ev.clientY}px`;
    regionDiv.style.position = `fixed`;
    dRef?.current?.insertAdjacentElement("beforeend", regionDiv);
    isDrawing = true;
  }

  function doDraw(ev: MouseEvent) {
    if (isDrawing && regionDiv) {
      console.log("doDraw", ev.clientX, ev.offsetX);
      if (ev.clientX < startX) {
        regionDiv.style.left = `${ev.clientX}px`;
        regionDiv.style.width = `${Math.abs(ev.clientX - startX)}px`;
      } else {
        regionDiv.style.width = `${ev.clientX - startX}px`;
      }
      if (ev.clientY < startY) {
        regionDiv.style.top = `${ev.clientY}px`;
        regionDiv.style.height = `${Math.abs(ev.clientY - startY)}px`;
      } else {
        regionDiv.style.height = `${ev.clientY - startY}px`;
      }
    }
  }

  function stopDraw(ev: MouseEvent) {
    console.log("stopDraw");
    isDrawing = false;
    const br = regionDiv.getBoundingClientRect();
    ipcRenderer.send("region-selected", { x: br.x, y: br.y, width: br.width, height: br.height });
  }

  return <div ref={dRef} className="h-screen w-screen bg-[#3b3b3b34]"></div>;
}
