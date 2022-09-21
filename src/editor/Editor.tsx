import Button from "@/common/Button";
import TextBox from "@/common/TextBox";
import PathHelper from "@/libs/helpers/pathHelper";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import useEditor from "./useEditor";

export default function VideoEditor() {
  const location = useLocation();
  const videoPath = location.state as string;

  if (!videoPath) console.error("TODO: No Video Path in state, return to home or show error");

  const [error, setError] = useState<string>();

  useEffect(() => {
    PathHelper.exists(videoPath).then((v) => {
      if (!v) setError("Video file does not exist!");
    });
  }, [videoPath]);

  // TODO add to below return so we can still show top bar with back/delete btns
  if (error) {
    return <div>{error}</div>;
  }

  let playerRef = useRef<HTMLVideoElement>(null);
  const { playPause, playBtnIcon, volume, volumeIcon, updateVolume, toggleMute } = useEditor(playerRef);

  return (
    <div className="flex flex-col">
      <div className="flex gap-1.5 m-1.5">
        <Button icon="arrow" iconDirection="left" />
        <TextBox value="" placeholder="name" className="w-full" onChange={() => {}} />
        <Button icon="close" />
      </div>

      <video ref={playerRef} src={"secfile://" + videoPath} controls></video>

      <div className="flex gap-5 m-5">
        <Button icon={playBtnIcon} onClick={playPause} />
        <Button
          icon={volumeIcon}
          slider={{
            value: volume,
            min: 0,
            max: 1,
            step: 0.01,
            wheelStep: 0.1,
            onChange: (val) => {
              updateVolume(val);
            }
          }}
          onClick={toggleMute}
        />
      </div>
    </div>
  );
}
