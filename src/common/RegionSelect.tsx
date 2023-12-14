import { ipcRenderer } from "electron";
import { useEffect, useRef } from "react";

export default function RegionSelect() {
  const dRef = useRef<HTMLDivElement>(null);
  let startX: number;
  let startY: number;
  let isDrawing = false;
  let regionDiv: HTMLDivElement;
  let regionDimensionsSpan: HTMLSpanElement;

  useEffect(() => {
    if (dRef?.current) {
      dRef.current.addEventListener("mousedown", startDraw);
      dRef.current.addEventListener("mousemove", doDraw);
      dRef.current.addEventListener("mouseup", stopDraw);
      window.addEventListener("keyup", keyUp);

      return () => {
        dRef.current?.removeEventListener("mousedown", startDraw);
        dRef.current?.removeEventListener("mousemove", doDraw);
        dRef.current?.removeEventListener("mouseup", stopDraw);
        window?.removeEventListener("keyup", keyUp);
      };
    }
  }, []);

  function startDraw(ev: MouseEvent) {
    try {
      console.log("startDraw");
      startX = ev.clientX;
      startY = ev.clientY;
      regionDiv = document.createElement("div");
      regionDiv.style.backgroundColor = "transparent";
      regionDiv.style.border = "2px dashed white";
      regionDiv.style.left = `${ev.clientX}px`;
      regionDiv.style.top = `${ev.clientY}px`;
      regionDiv.style.position = `fixed`;
      regionDimensionsSpan = document.createElement("span");
      regionDimensionsSpan.style.width = "100%";
      regionDimensionsSpan.style.height = "100%";
      regionDimensionsSpan.style.justifyContent = "center";
      regionDimensionsSpan.style.alignItems = "center";
      regionDimensionsSpan.style.userSelect = "none";
      regionDimensionsSpan.style.filter = "drop-shadow(0px 0px 4px black)";
      regionDimensionsSpan.style.whiteSpace = "nowrap";
      regionDiv.insertAdjacentElement("beforeend", regionDimensionsSpan);
      dRef?.current?.insertAdjacentElement("beforeend", regionDiv);
      isDrawing = true;
    } catch (err) {
      ipcRenderer.send("region-select-cancelled", "startDraw failed", err);
    }
  }

  function doDraw(ev: MouseEvent) {
    try {
      if (isDrawing && regionDiv) {
        console.log("doDraw", ev.clientX, ev.offsetX);
        let newW;
        let newH;
        if (ev.clientX < startX) {
          regionDiv.style.left = `${ev.clientX}px`;
          newW = Math.abs(ev.clientX - startX);
        } else {
          newW = ev.clientX - startX;
        }
        if (ev.clientY < startY) {
          regionDiv.style.top = `${ev.clientY}px`;
          newH = Math.abs(ev.clientY - startY);
        } else {
          newH = ev.clientY - startY;
        }
        regionDiv.style.width = `${newW}px`;
        regionDiv.style.height = `${newH}px`;
        // Show dimensions and hide/show
        regionDimensionsSpan.innerText = `${regionDiv.style.width} x ${regionDiv.style.height}`;
        if (newW < 120 || newH < 30) {
          regionDimensionsSpan.style.display = "none";
        } else {
          regionDimensionsSpan.style.display = "flex";
        }
      }
    } catch (err) {
      ipcRenderer.send("region-select-cancelled", "doDraw failed", err);
    }
  }

  function stopDraw() {
    try {
      console.log("stopDraw");
      isDrawing = false;
      const br = regionDiv.getBoundingClientRect();
      ipcRenderer.send("region-selected", { x: br.x, y: br.y, width: br.width, height: br.height });
    } catch (err) {
      ipcRenderer.send("region-select-cancelled", "stopDraw failed", err);
    }
  }

  function keyUp(ev: KeyboardEvent) {
    if (ev.key?.toLowerCase() === "escape") {
      ipcRenderer.send("region-select-cancelled", "escape key pressed");
    }
  }

  return <div ref={dRef} className="h-screen w-screen bg-[#3b3b3b34]"></div>;
}
