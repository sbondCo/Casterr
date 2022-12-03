import { APP_SETTINGS, DEFAULT_SETTINGS } from "@/app/constants";
import { RootState } from "@/app/store";
import DropDown, { DropDownItem } from "@/common/DropDown";
import TextBox from "@/common/TextBox";
import TickBox from "@/common/TickBox";
import { useDispatch, useSelector } from "react-redux";
import SettingsItem from "../SettingsItem";
import {
  setFormat,
  setFps,
  setMonitorToRecord,
  setResolution,
  setSeperateAudioTracks,
  setThumbSaveFolder,
  setVideoDevice,
  setVideoSaveFolder,
  setVideoSaveName
} from "../settingsSlice";

export default function Recording() {
  const state = useSelector((store: RootState) => store.settings.recording);
  const dispatch = useDispatch();

  const videoDevices = ["Default"];
  const monitors = new Array<DropDownItem>({ id: "primary", name: "Primary Monitor" });
  const resolutions = ["In-Game", "2160p", "1440p", "1080p", "720p", "480p", "360p"];

  return (
    <>
      <SettingsItem title="Video Device">
        <DropDown activeItem={state.videoDevice} items={videoDevices} onChange={(s) => setVideoDevice(s as string)} />
      </SettingsItem>

      <SettingsItem title="Monitor To Record">
        <DropDown
          activeItem={state.monitorToRecord}
          items={monitors}
          onChange={(s) => setMonitorToRecord(s as DropDownItem)}
        />
      </SettingsItem>

      <SettingsItem title="FPS">
        <TextBox
          type="number"
          value={state.fps}
          placeholder={DEFAULT_SETTINGS.recording.fps}
          onChange={(s) => {
            dispatch(setFps(s));
          }}
        />
      </SettingsItem>

      <SettingsItem title="Resolution">
        <DropDown activeItem={state.resolution} items={resolutions} onChange={(s) => setResolution(s as string)} />
      </SettingsItem>

      <SettingsItem title="Format">
        <DropDown
          activeItem={state.format}
          items={APP_SETTINGS.supportedRecordingFormats}
          onChange={(s) => setFormat(s as string)}
        />
      </SettingsItem>

      <SettingsItem title="Separate Audio Tracks" row>
        <TickBox ticked={state.seperateAudioTracks} onChange={(t) => setSeperateAudioTracks(t)} />
      </SettingsItem>

      <SettingsItem title="Thumbnail Save Folder">
        <TextBox
          value={state.thumbSaveFolder}
          placeholder={DEFAULT_SETTINGS.recording.thumbSaveFolder}
          folderSelect
          onChange={(s) => setThumbSaveFolder(s)}
        />
      </SettingsItem>

      <SettingsItem title="Video Save Folder">
        <TextBox
          value={state.videoSaveFolder}
          placeholder={DEFAULT_SETTINGS.recording.videoSaveFolder}
          folderSelect
          onChange={(s) => setVideoSaveFolder(s)}
        />
      </SettingsItem>

      <SettingsItem title="Video Save Name">
        <TextBox
          value={state.videoSaveName}
          placeholder={DEFAULT_SETTINGS.recording.videoSaveName}
          onChange={(s) => setVideoSaveName(s)}
        />
      </SettingsItem>
    </>
  );
}
