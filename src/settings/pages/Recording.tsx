import { RootState } from "@/app/store";
import DropDown from "@/common/DropDown";
import { useDispatch, useSelector } from "react-redux";
import SettingsItem from "../SettingsItem";

export default function Recording() {
  const state = useSelector((store: RootState) => store.settings.recording);
  const dispatch = useDispatch();

  const videoDevices = ["Default"];

  return (
    <>
      <SettingsItem title="Video Device">
        <DropDown activeItem={state.videoDevice} items={videoDevices} onChange={(s) => {}} />
      </SettingsItem>
    </>
  );
}
