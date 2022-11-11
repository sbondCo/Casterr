import Popup from "@/common/Popup";
import { useSelector } from "react-redux";
import { RootState } from "./store";

/**
 * Init component for things such as popups, tooltips, etc.
 */
export default function Init() {
  const popups = useSelector((store: RootState) => store.app.popups);

  return (
    <>
      {popups && popups.length > 0 && (
        <div className="flex flex-col justify-center items-center absolute h-screen w-screen z-50 bg-quaternary-100 bg-opacity-50">
          {popups.map((p) => (
            <Popup key={p.title} {...p} />
          ))}
        </div>
      )}
    </>
  );
}
