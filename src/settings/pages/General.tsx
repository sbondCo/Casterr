import { APP_SETTINGS } from "@/app/constants";
import { RootState } from "@/app/store";
import DropDown from "@/common/DropDown";
import TickBox from "@/common/TickBox";
import { useDispatch, useSelector } from "react-redux";
import SettingsItem from "../SettingsItem";
import { Page } from "../types";
import {
  setDeleteVideoConfirmationDisabled,
  setDeleteVideosFromDisk,
  setRcStatusAlsoStopStart,
  setRcStatusDblClkToRecord,
  setStartupPage
} from "./../settingsSlice";

export default function General() {
  const state = useSelector((store: RootState) => store.settings.general);
  const dispatch = useDispatch();

  return (
    <>
      <SettingsItem title="Startup Page">
        <DropDown
          activeItem={state.startupPage}
          items={APP_SETTINGS.pages}
          onChange={(s) => {
            dispatch(setStartupPage(s as Page));
          }}
        />
      </SettingsItem>

      <SettingsItem title="Recording Status Also Stop/Start Recording" row>
        <TickBox ticked={state.rcStatusAlsoStopStart} onChange={(t) => dispatch(setRcStatusAlsoStopStart(t))} />
      </SettingsItem>

      <SettingsItem title="Recording Status Double Click To Record" row>
        <TickBox ticked={state.rcStatusDblClkToRecord} onChange={(t) => dispatch(setRcStatusDblClkToRecord(t))} />
      </SettingsItem>

      <SettingsItem title="Disable Delete Video Confirmation" row>
        <TickBox
          ticked={state.deleteVideoConfirmationDisabled}
          onChange={(t) => dispatch(setDeleteVideoConfirmationDisabled(t))}
        />
      </SettingsItem>

      <SettingsItem title="Delete Videos From Disk By Default" row>
        <TickBox ticked={state.deleteVideosFromDisk} onChange={(t) => dispatch(setDeleteVideosFromDisk(t))} />
      </SettingsItem>
    </>
  );
}
