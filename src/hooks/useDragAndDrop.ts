import { logger } from "@/libs/logger";
import { useEffect, useState } from "react";

/**
 * Add drag and drop functionality to an element.
 * @param elRef Reference to element to apply drag and drop to.
 * @param fileDropped Callback that is called for each file that is dropped.
 */
export default function useDragAndDrop(elRef: React.RefObject<HTMLElement>, fileDropped: (f: File) => void) {
  const [dropZoneShown, setDropZoneShown] = useState(false);
  const [dropZoneFLen, setDropZoneFLen] = useState<number>();
  let dragEnterTarget: EventTarget | null;

  useEffect(() => {
    const el = elRef.current;

    if (el) {
      el.addEventListener("drop", handleDrop);
      el.addEventListener("dragover", handleDragOver);
      el.addEventListener("dragenter", handleDragEnter);
      el.addEventListener("dragleave", handleDragLeave);

      return () => {
        if (el) {
          el.removeEventListener("drop", handleDrop);
          el.removeEventListener("dragover", handleDragOver);
          el.removeEventListener("dragenter", handleDragEnter);
          el.removeEventListener("dragleave", handleDragLeave);
        }
      };
    }
  }, []);

  const handleDrop = (ev: DragEvent) => {
    ev.preventDefault();
    ev.stopPropagation();

    setDropZoneShown(false);

    // Add dropped files to recordings
    if (ev.dataTransfer != null) {
      for (let i = 0; i < ev.dataTransfer.items.length; i++) {
        const item = ev.dataTransfer.items[i];
        const f = item.getAsFile();

        if (item.kind === "file" && f) {
          logger.info("DragAndDrop", "Running callback for dropped file:", f);
          fileDropped(f);
        }
      }
    }
  };

  const handleDragOver = (ev: DragEvent) => {
    // Prevent default behavior so out drop event will work.
    ev.preventDefault();
    ev.stopPropagation();
  };

  const handleDragEnter = (ev: DragEvent) => {
    ev.preventDefault();
    ev.stopPropagation();

    dragEnterTarget = ev.target;
    setDropZoneShown(true);

    if (ev.dataTransfer != null && ev.dataTransfer.items.length > 0 && ev.dataTransfer.items[0]) {
      setDropZoneFLen(ev.dataTransfer.items.length);
    }
  };

  const handleDragLeave = (ev: DragEvent) => {
    ev.preventDefault();
    ev.stopPropagation();

    // Only act as if drag has actually ended
    // if dragEnterTarget is the same as event.target.
    if (dragEnterTarget === ev.target) {
      setDropZoneShown(false);
    }
  };

  return {
    dropZoneShown,
    dropZoneFLen
  };
}
