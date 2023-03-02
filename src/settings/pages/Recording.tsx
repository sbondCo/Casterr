import { APP_SETTINGS, DEFAULT_SETTINGS } from "@/app/constants";
import { type RootState } from "@/app/store";
import DropDown, { type DropDownItem } from "@/common/DropDown";
import ListBox, { type ListBoxItem } from "@/common/ListBox";
import TextBox from "@/common/TextBox";
import TickBox from "@/common/TickBox";
import Notifications from "@/libs/helpers/notifications";
import { logger } from "@/libs/logger";
import DeviceManager from "@/libs/recorder/deviceManager";
import PlaybackRecorder from "@/libs/recorder/playback";
import { AnyAction } from "@reduxjs/toolkit";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import NamedContainer from "../../common/NamedContainer";
import {
  setFormat,
  setFps,
  setMonitorToRecord,
  setRecordThePast,
  setResolution,
  setSeperateAudioTracks,
  setThumbSaveFolder,
  setVideoDevice,
  setVideoSaveFolder,
  setVideoSaveName,
  toggleAudioDeviceToRecord
} from "../settingsSlice";

export default function Recording() {
  const state = useSelector((store: RootState) => store.settings.recording);
  const _dispatch = useDispatch();
  const dispatch = (d: AnyAction, restartPlayback = true) => {
    // Wrapper for dispatch hook so we know when a recording setting is changed.
    _dispatch(d);
    if (restartPlayback) {
      PlaybackRecorder.restart().catch((err) => {
        logger.error("Recording", "Failed to restart PlaybackRecorder after changing settings:", err);
        Notifications.desktop("PastRecorder Didn't Restart", "error").catch((err) =>
          logger.error("Recording", "Restarting playback fail notif failed:", err)
        );
      });
    }
  };

  const [audioDevicesToRecord, setAudioDevicesToRecord] = useState<ListBoxItem[]>();

  const videoDevices = ["Default"];
  const monitors = new Array<DropDownItem>({ id: "primary", name: "Primary Monitor" });
  const resolutions = ["In-Game", "2160p", "1440p", "1080p", "720p", "480p", "360p"];
  const recordThePastItems: DropDownItem[] = [
    { id: 0, name: "Disabled" },
    { id: 30, name: "30 secs" },
    { id: 60, name: "1 min" },
    { id: 120, name: "2 mins" },
    { id: 180, name: "3 mins" },
    { id: 300, name: "5 mins" },
    { id: 480, name: "8 mins" },
    { id: 600, name: "10 mins" },
    { id: 900, name: "15 mins" },
    { id: 1200, name: "20 mins" },
    { id: 1800, name: "30 mins" }
  ];
  const recordThePastActiveItem = recordThePastItems.find((v) => v.id === state.recordThePast);

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
          onChange={(s) => {
            dispatch(setVideoDevice(s as string));
          }}
        />
      </NamedContainer>

      <NamedContainer title="Monitor To Record">
        <DropDown
          activeItem={state.monitorToRecord}
          items={monitors}
          onChange={(s) => {
            dispatch(setMonitorToRecord(s as DropDownItem));
          }}
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

      <NamedContainer title="Resolution">
        <DropDown
          activeItem={state.resolution}
          items={resolutions}
          onChange={(s) => {
            dispatch(setResolution(s as string));
          }}
        />
      </NamedContainer>

      <NamedContainer title="Format">
        <DropDown
          activeItem={state.format}
          items={APP_SETTINGS.supportedRecordingFormats}
          onChange={(s) => {
            dispatch(setFormat(s as string));
          }}
        />
      </NamedContainer>

      <NamedContainer title="Record The Past">
        <DropDown
          activeItem={recordThePastActiveItem ?? recordThePastItems[0]}
          items={recordThePastItems}
          onChange={(s) => {
            const id = (s as DropDownItem).id;
            const stillEnabled = id !== 0;
            dispatch(setRecordThePast(id), stillEnabled);
            if (!stillEnabled) {
              PlaybackRecorder.stop().catch((err) => {
                logger.error("Recording", "Failed to restart PlaybackRecorder after changing settings:", err);
                Notifications.desktop("PastRecorder Didn't Stop", "error").catch((err) =>
                  logger.error("Recording", "Stopping playback fail notif failed:", err)
                );
              });
            }
          }}
        />
      </NamedContainer>

      <NamedContainer title="Separate Audio Tracks" row>
        <TickBox
          ticked={state.seperateAudioTracks}
          onChange={(t) => {
            dispatch(setSeperateAudioTracks(t));
          }}
        />
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
          onChange={(s) => {
            dispatch(setThumbSaveFolder(s), false);
          }}
        />
      </NamedContainer>

      <NamedContainer title="Video Save Folder">
        <TextBox
          value={state.videoSaveFolder}
          placeholder={DEFAULT_SETTINGS.recording.videoSaveFolder}
          folderSelect
          onChange={(s) => {
            dispatch(setVideoSaveFolder(s), false);
          }}
        />
      </NamedContainer>

      <NamedContainer title="Video Save Name">
        <TextBox
          value={state.videoSaveName}
          placeholder={DEFAULT_SETTINGS.recording.videoSaveName}
          onChange={(s) => {
            dispatch(setVideoSaveName(s), false);
          }}
        />
      </NamedContainer>
    </>
  );
}
