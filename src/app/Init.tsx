import Popup from "@/common/Popup";
import { useSelector } from "react-redux";
import { RootState } from "./store";

/**
 * Init component for things such as popups, tooltips, etc.
 */
export default function Init() {
  const popups = useSelector((store: RootState) => store.app.popups);

  return <>{popups && popups.map((p) => <Popup {...p} />)}</>;
}
