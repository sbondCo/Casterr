import Button from "@/common/Button";
import ButtonConnector from "@/common/ButtonConnector";
import Icon from "@/common/Icon";
import TextBox from "@/common/TextBox";
import PathHelper from "@/libs/helpers/pathHelper";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useEditor from "./useEditor";
import "nouislider/dist/nouislider.min.css";
import "./editor.scss";
import { Video } from "@/videos/types";
import RecordingsManager from "@/libs/recorder/recordingsManager";
import { useDispatch } from "react-redux";
import { videoRenamed } from "@/videos/videosSlice";

export default function VideoEditor() {
  const navigate = useNavigate();
  const location = useLocation();
  const video = location.state as Video;
  const dispatch = useDispatch();

  if (!video.videoPath) console.error("TODO: No Video Path in state, return to home or show error");

  const [error, setError] = useState<string>();

  useEffect(() => {
    PathHelper.exists(video.videoPath).then((v) => {
      if (!v) setError("Video file does not exist!");
    });
  }, [video.videoPath]);

  let playerRef = useRef<HTMLVideoElement>(null);
  let timelineRef = useRef<HTMLDivElement>(null);
  let progressBarRef = useRef<HTMLDivElement>(null);
  let clipsBarRef = useRef<HTMLDivElement>(null);
  const {
    playPause,
    playBtnIcon,
    volume,
    volumeIcon,
    updateVolume,
    toggleMute,
    videoTimeReadable,
    toggleShowTimeAsElapsed,
    numberOfClips,
    lengthOfClips,
    renderBtnDisabled,
    addClip,
    playClips,
    isPlayingClips,
    adjustZoom
  } = useEditor(playerRef, timelineRef, progressBarRef, clipsBarRef);

  return (
    <div className="flex h-[calc(100vh_-_77px)] flex-col gap-1.5 my-1.5 h-full">
      <div className="flex gap-1.5 mx-1.5">
        <Button icon="arrow" iconDirection="left" onClick={() => navigate(-1)} />
        <TextBox
          value={video.name}
          placeholder="Name"
          className="w-full"
          onChange={(newName) => {
            console.log("Changing video name to:", newName);
            dispatch(videoRenamed({ videoPath: video.videoPath, newName: newName }));
          }}
        />
        <Button icon="close" />
      </div>

      {!error ? (
        <video
          className="flex-1 overflow-auto bg-[#000]"
          ref={playerRef}
          src={"secfile://" + video.videoPath}
          onClick={playPause}
        ></video>
      ) : (
        <div className="flex flex-1 overflow-auto items-center justify-center bg-[#000] text-xl">
          <span>{error}</span>
        </div>
      )}

      <div ref={timelineRef} className="timeline">
        <div ref={progressBarRef} id="progressBar" className="progressBar"></div>
        <div ref={clipsBarRef} id="clipsBar" className="clipsBar"></div>
      </div>

      <div className="flex gap-1.5 mx-1.5">
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
        <Button text={videoTimeReadable} outlined={true} onClick={() => toggleShowTimeAsElapsed()} />
        <Button text="Add Clip" onClick={addClip} />
        <Button icon="add" onClick={() => adjustZoom(true)} />
        <Button icon="min2" onClick={() => adjustZoom(false)} />
        <div className="ml-auto"></div>
        <ButtonConnector>
          <Button outlined={true} onClick={playClips} className="relative">
            {isPlayingClips && (
              <div className="flex left-0 top-0 items-center justify-center absolute w-full h-full bg-primary-100 bg-opacity-90">
                <Icon i="pause" wh={16} />
              </div>
            )}

            <div className="flex gap-1.5 items-center">
              <Icon i="clips" wh={18} />
              <span>{numberOfClips}</span>
            </div>

            <div className="flex gap-1.5 items-center">
              <Icon i="time" wh={18} />
              <span>{lengthOfClips.toReadableTimeFromSeconds()}</span>
            </div>
          </Button>
          <Button icon="arrow" disabled={renderBtnDisabled} />
        </ButtonConnector>
      </div>
    </div>
  );
}
