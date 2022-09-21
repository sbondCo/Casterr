import { useEffect, useState } from "react";

type PlayBtnIcon = "play" | "pause";
type VolumeBtnIcon = "play" | "pause";

export default function useEditor(playerRef: React.RefObject<HTMLVideoElement>) {
  const [playBtnIcon, setPlayBtnIcon] = useState<PlayBtnIcon>("play");
  const [volume, setVolume] = useState<number>(0.8);
  const [volumeIcon, setVolumeIcon] = useState<"volumeMute" | "volumeMed" | "volumeMax">("volumeMax");

  let player = playerRef.current!;

  useEffect(() => {
    player = playerRef.current!;
    if (player) {
      // TODO volume should be stored in state (settings?) and restored - volume being reset to default when looking at diff clips is not nice
      updateVolume(0.8); // Set default volume and icon

      player.addEventListener("play", updatePlayBtnIcon);
      player.addEventListener("pause", updatePlayBtnIcon);

      return () => {
        player.removeEventListener("play", updatePlayBtnIcon);
        player.removeEventListener("pause", updatePlayBtnIcon);
      };
    }
  }, []);

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
    toggleMute
  };
}
