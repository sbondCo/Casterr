import React, { useEffect, useState } from "react";
import noUiSlider, { PipsMode, target } from "nouislider";

export default function useEditor(
  playerRef: React.RefObject<HTMLVideoElement>,
  progressBarRef: React.RefObject<HTMLDivElement>
) {
  const [playBtnIcon, setPlayBtnIcon] = useState<"play" | "pause">("play");
  const [volume, setVolume] = useState<number>(0.8);
  const [volumeIcon, setVolumeIcon] = useState<"volumeMute" | "volumeMed" | "volumeMax">("volumeMax");
  const [videoTimeReadable, setVideoTimeReadable] = useState<string>("00:00 / 00:00");
  const [showTimeAsElapsed, setShowTimeAsElapsed] = useState<boolean>(false);
  const [playerCurTime, setPlayerCurTime] = useState<number>(0);

  let player = playerRef.current!;
  let progressBar = progressBarRef.current! as target;

  useEffect(() => {
    player = playerRef.current!;
    progressBar = progressBarRef.current!;

    if (player && progressBar) {
      player.addEventListener("loadedmetadata", videoLoaded);
      player.addEventListener("play", updatePlayBtnIcon);
      player.addEventListener("pause", updatePlayBtnIcon);
      player.addEventListener("timeupdate", videoTimeUpdate);

      return () => {
        player.removeEventListener("loadedmetadata", videoLoaded);
        player.removeEventListener("play", updatePlayBtnIcon);
        player.removeEventListener("pause", updatePlayBtnIcon);
        player.removeEventListener("timeupdate", videoTimeUpdate);
      };
    }
  }, []);

  // Update when playerCurTime/showTimeAsElapsed changes.
  // Currently just updates the readable video time.
  useEffect(() => {
    let maxVideoTime = player.duration;
    if (showTimeAsElapsed) {
      setVideoTimeReadable(`${(maxVideoTime - currentVideoTime()).toReadableTimeFromSeconds()} Left`);
    } else {
      setVideoTimeReadable(
        `${currentVideoTime().toReadableTimeFromSeconds()} / ${maxVideoTime.toReadableTimeFromSeconds()}`
      );
    }
  }, [playerCurTime, showTimeAsElapsed]);

  /**
   * EV HANDLER
   */
  const videoLoaded = () => {
    // TODO volume should be stored in state (settings?) and restored - volume being reset to default when looking at diff clips is not nice
    updateVolume(0.8); // Set default volume and icon

    // updateReadableVideoTime();

    if (!progressBar.classList.contains("noUi-target")) {
      noUiSlider.create(progressBar, {
        start: [0],
        behaviour: "snap",
        animate: false,
        range: {
          min: 0,
          max: player.duration
        },
        pips: {
          mode: PipsMode.Count,
          values: 10,
          format: {
            to: (value: number) => {
              // Show readable time on pip values
              return value.toReadableTimeFromSeconds();
            },
            from: (value: string) => {
              return Number(value);
            }
          }
        }
      });
      progressBar.noUiSlider!.off("");

      progressBar.noUiSlider!.on("slide", (_0: any, _1: any, unencoded: number[]) => {
        updateVideoTime(unencoded[0]);
      });

      progressBar.noUiSlider!.on("start", () => {
        player.removeEventListener("timeupdate", updateProgressBarTime);
        // cancelPlayingClips();
      });

      progressBar.noUiSlider!.on("end", () => {
        player.addEventListener("timeupdate", updateProgressBarTime);
      });

      progressBar.addEventListener("dblclick", () => {
        // addClip();
      });
    }
  };

  /**
   * EV HANDLER
   */
  const videoTimeUpdate = () => {
    setPlayerCurTime(player.currentTime);
    updateProgressBarTime();
  };

  const currentVideoTime = () => player.currentTime || 0;
  const toggleShowTimeAsElapsed = () => setShowTimeAsElapsed(!showTimeAsElapsed);

  /**
   * Update time on video element.
   * @param newTime Time to skip to.
   */
  const updateVideoTime = (newTime: number) => {
    player.currentTime = newTime;
  };

  /**
   * Update time on progress bar with current time on video.
   */
  const updateProgressBarTime = () => {
    progressBar.noUiSlider!.set(player.currentTime);
  };

  const updatePlayBtnIcon = (ev: Event) => {
    console.log("updatePlayBtnIcon()", ev.type);
    if (ev.type === "play") setPlayBtnIcon("pause");
    else setPlayBtnIcon("play");
  };

  const playPause = () => {
    if (player.paused) {
      player.play();
    } else {
      player.pause();
    }
  };

  const updateVolume = (vol: number) => {
    setVolume(vol);
    player.volume = vol;

    // Change volume icon depending on volume
    if (vol == 0) {
      setVolumeIcon("volumeMute");
    } else if (vol < 0.5) {
      setVolumeIcon("volumeMed");
    } else {
      setVolumeIcon("volumeMax");
    }
  };

  const toggleMute = () => {
    if (volume > 0) {
      updateVolume(0);
    } else {
      updateVolume(0.5);
    }
  };

  return {
    playBtnIcon,
    playPause,
    volume,
    volumeIcon,
    updateVolume,
    toggleMute,
    videoTimeReadable,
    toggleShowTimeAsElapsed
  };
}
