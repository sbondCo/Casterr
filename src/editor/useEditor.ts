import { useEffect, useState } from "react";

type PlayBtnIcon = "play" | "pause";

export default function useEditor(playerRef: React.RefObject<HTMLVideoElement>) {
  const [playBtnIcon, setPlayBtnIcon] = useState<PlayBtnIcon>("play");

  let player = playerRef.current!;

  useEffect(() => {
    player = playerRef.current!;
    if (player) {
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

  return {
    playBtnIcon,
    playPause
  };
}
