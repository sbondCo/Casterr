import { ipcRenderer } from "electron";
import { useEffect, useRef } from "react";

export default function RegionSelect() {
  const dRef = useRef<HTMLDivElement>(null);
  let startX: number;
  let startY: number;
  let isDrawing = false;
  let regionDiv: HTMLDivElement;
  let regionDimensionsDiv: HTMLSpanElement;
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
      if (regionDiv) return;
      console.log("startDraw");
      startX = ev.clientX;
      startY = ev.clientY;
      regionDiv = document.createElement("div");
      regionDiv.style.backgroundColor = "transparent";
      regionDiv.style.border = "2px dashed white";
      regionDiv.style.left = `${ev.clientX}px`;
      regionDiv.style.top = `${ev.clientY}px`;
      regionDiv.style.position = `fixed`;
      regionDimensionsDiv = document.createElement("div");
      regionDimensionsDiv.style.width = "100%";
      regionDimensionsDiv.style.height = "100%";
      regionDimensionsDiv.style.justifyContent = "center";
      regionDimensionsDiv.style.alignItems = "center";
      regionDimensionsDiv.style.userSelect = "none";
      regionDimensionsSpan = document.createElement("span");
      regionDimensionsSpan.style.color = "black";
      regionDimensionsSpan.style.backgroundColor = "rgba(255, 255, 255, 0.5)";
      regionDimensionsSpan.style.borderRadius = "8px";
      regionDimensionsSpan.style.padding = "10px";
      regionDimensionsDiv.style.whiteSpace = "nowrap";
      regionDimensionsDiv.insertAdjacentElement("beforeend", regionDimensionsSpan);
      regionDiv.insertAdjacentElement("beforeend", regionDimensionsDiv);
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
          regionDimensionsDiv.style.display = "none";
        } else {
          regionDimensionsDiv.style.display = "flex";
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
