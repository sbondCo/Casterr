import { APP_SETTINGS, DEFAULT_SETTINGS } from "@/app/constants";
import { type RootState } from "@/app/store";
import DropDown, { type DropDownItem } from "@/common/DropDown";
import ListBox, { type ListBoxItem } from "@/common/ListBox";
import TextBox from "@/common/TextBox";
import TickBox from "@/common/TickBox";
import { logger } from "@/libs/logger";
import DeviceManager from "@/libs/recorder/deviceManager";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import NamedContainer from "../../common/NamedContainer";
import {
  setFormat,
  setFps,
  setHardwareEncoding,
  setMonitorToRecord,
  setResolution,
  setResolutionKeepAspectRatio,
  setSeperateAudioTracks,
  setThumbSaveFolder,
  setVideoDevice,
  setVideoSaveFolder,
  setVideoSaveName,
  toggleAudioDeviceToRecord
} from "../settingsSlice";
import type { ResolutionScale } from "../types";

export default function Recording() {
  const state = useSelector((store: RootState) => store.settings.recording);
  const dispatch = useDispatch();

  const [audioDevicesToRecord, setAudioDevicesToRecord] = useState<ListBoxItem[]>();

  const videoDevices = ["Default"];
  const monitors = new Array<DropDownItem>({ id: "primary", name: "Primary Monitor" });
  const resolutions: ResolutionScale[] = ["disabled", "2160p", "1440p", "1080p", "720p", "480p", "360p", "custom"];

  useEffect(() => {
    DeviceManager.getDevices()
      .then((devices) => {
        setAudioDevicesToRecord(
          devices.audio.map((ad) => {
            return {
              id: String(ad.id),
              name: `${ad.name} ${ad.isInput !== undefined ? `(${ad.isInput ? "microphone" : "speaker"})` : ""}`
            };
          })
        );
      })
      .catch((err) => logger.error("Recording", "Failed to get audio devices!", err));
  }, []);

  return (
    <>
      <NamedContainer title="Video Device">
        <DropDown
          activeItem={state.videoDevice}
          items={videoDevices}
          onChange={(s) => dispatch(setVideoDevice(s as string))}
        />
      </NamedContainer>

      <NamedContainer title="Monitor To Record">
        <DropDown
          activeItem={state.monitorToRecord}
          items={monitors}
          onChange={(s) => dispatch(setMonitorToRecord(s as DropDownItem))}
        />
      </NamedContainer>

      <NamedContainer title="Format">
        <DropDown
          activeItem={state.format}
          items={APP_SETTINGS.supportedRecordingFormats}
          onChange={(s) => dispatch(setFormat(s as string))}
        />
      </NamedContainer>

      <NamedContainer title="FPS">
        <TextBox
          type="number"
          value={state.fps}
          placeholder={DEFAULT_SETTINGS.recording.fps}
          onChange={(s) => {
            dispatch(setFps(s));
          }}
        />
      </NamedContainer>

      <NamedContainer title="Resolution Scale">
        <DropDown
          activeItem={state.resolution}
          items={resolutions}
          onChange={(s) => dispatch(setResolution(s as ResolutionScale))}
          className="capitalize"
        />
      </NamedContainer>

      {state.resolution !== "disabled" && (
        <NamedContainer
          title="Keep Aspect Ratio"
          desc="When using the resolution scaling option, you can decide if you want to keep the original aspect ratio or not."
          row
        >
          <TickBox
            ticked={state.resolutionKeepAspectRatio}
            onChange={(t) => dispatch(setResolutionKeepAspectRatio(t))}
          />
        </NamedContainer>
      )}

      {process.platform === "linux" && (
        <NamedContainer
          title="Hardware Encoding"
          desc="Experimental NVENC Support. Offloads Video Encoding to NVIDIA GPU."
          row
        >
          <TickBox ticked={state.hardwareEncoding} onChange={(t) => dispatch(setHardwareEncoding(t))} />
        </NamedContainer>
      )}

      <NamedContainer title="Separate Audio Tracks" row>
        <TickBox ticked={state.seperateAudioTracks} onChange={(t) => dispatch(setSeperateAudioTracks(t))} />
      </NamedContainer>

      <NamedContainer title="Audio Devices To Record">
        <ListBox
          options={audioDevicesToRecord}
          enabled={state.audioDevicesToRecord.map((ad) => {
            return ad;
          })}
          onChange={(isEnabled, aId) => {
            dispatch(toggleAudioDeviceToRecord({ id: aId, isEnabled }));
          }}
        />
      </NamedContainer>

      <NamedContainer title="Thumbnail Save Folder">
        <TextBox
          value={state.thumbSaveFolder}
          placeholder={DEFAULT_SETTINGS.recording.thumbSaveFolder}
          folderSelect
          onChange={(s) => dispatch(setThumbSaveFolder(s))}
        />
      </NamedContainer>

      <NamedContainer title="Video Save Folder">
        <TextBox
          value={state.videoSaveFolder}
          placeholder={DEFAULT_SETTINGS.recording.videoSaveFolder}
          folderSelect
          onChange={(s) => dispatch(setVideoSaveFolder(s))}
        />
      </NamedContainer>

      <NamedContainer title="Video Save Name">
        <TextBox
          value={state.videoSaveName}
          placeholder={DEFAULT_SETTINGS.recording.videoSaveName}
          onChange={(s) => dispatch(setVideoSaveName(s))}
        />
      </NamedContainer>
    </>
  );
}
