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
import type { Video } from "@/videos/types";
import RecordingsManager from "@/libs/recorder/recordingsManager";
import { useDispatch, useSelector } from "react-redux";
import { videoBookmarkAdded, videoBookmarkRemoved, videoRenamed } from "@/videos/videosSlice";
import { type RootState } from "@/app/store";
import { toReadableTimeFromSeconds } from "@/libs/helpers/extensions/number";
import Tooltip from "@/common/Tooltip";
import { logger } from "@/libs/logger";
import { setVideoEditorVolume } from "@/settings/settingsSlice";

export default function VideoEditor() {
  const navigate = useNavigate();
  const location = useLocation();
  const video = location.state as Video;
  const dispatch = useDispatch();
  const genState = useSelector((store: RootState) => store.settings.general);

  if (!video.videoPath) logger.error("Editor", "TODO: No Video Path in state, return to home or show error");

  const [error, setError] = useState<string>();

  useEffect(() => {
    PathHelper.exists(video.videoPath)
      .then((v) => {
        if (!v) setError("Video file does not exist!");
      })
      .catch((e) => logger.error("Editor", "Unable to verify video files existence.", e));
  }, [video.videoPath]);

  const onBookmarkAdded = (bookmark: number) => {
    dispatch(videoBookmarkAdded({ videoPath: video.videoPath, isClip: video.isClip, bookmark }));
  };

  const onBookmarkRemoved = (bookmark: number) => {
    dispatch(videoBookmarkRemoved({ videoPath: video.videoPath, isClip: video.isClip, bookmark }));
  };

  const playerRef = useRef<HTMLVideoElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const clipsBarRef = useRef<HTMLDivElement>(null);
  const bookmarksBarRef = useRef<HTMLDivElement>(null);
  const {
    clipsBar,
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
    adjustZoom,
    lockOnScrubber,
    setLockOnScrubber,
    addBookmark
  } = useEditor(
    playerRef,
    timelineRef,
    progressBarRef,
    clipsBarRef,
    bookmarksBarRef,
    genState.videoEditorVolume,
    onBookmarkAdded,
    onBookmarkRemoved,
    video.bookmarks
  );

  return (
    <div className="flex flex-col gap-1.5 my-1.5 h-[calc(100vh-77px)]">
      <div className="flex gap-1.5 mx-1.5">
        <Tooltip text="Back To Videos">
          <Button
            icon="arrow"
            iconDirection="left"
            onClick={() => {
              navigate(-1);
            }}
          />
        </Tooltip>
        <TextBox
          value={video.name}
          placeholder="Name"
          className="w-full"
          onChange={(newName) => {
            logger.info("Editor", "Changing video name to:", newName);
            dispatch(videoRenamed({ videoPath: video.videoPath, newName, isClip: video.isClip }));
          }}
        />
        <Button
          icon="close"
          onClick={() => {
            RecordingsManager.deleteWithConfirmation(video)
              .then((deleted) => {
                if (deleted) navigate(-1);
              })
              .catch((err: any) => {
                logger.error("Editor", "Failed to delete video with confirmation", err);
              });
          }}
        />
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
        <div ref={bookmarksBarRef} id="bookmarksBar" className="bookmarksBar"></div>
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
            },
            onFinishedChanging: (val) => {
              dispatch(setVideoEditorVolume(val));
            }
          }}
          onClick={() => {
            const newVol = toggleMute();
            dispatch(setVideoEditorVolume(newVol));
          }}
        />
        <Button
          text={videoTimeReadable}
          outlined={true}
          onClick={() => {
            toggleShowTimeAsElapsed();
          }}
        />
        <Button text="Add Clip" onClick={addClip} />
        <Tooltip text="Zoom In (Z)">
          <Button
            icon="add"
            onClick={() => {
              adjustZoom(true);
            }}
          />
        </Tooltip>
        <Tooltip text="Zoom Out (X)">
          <Button
            icon="min2"
            onClick={() => {
              adjustZoom(false);
            }}
          />
        </Tooltip>
        <Tooltip text="Bookmark (B)">
          <Button
            icon="bookmark"
            onClick={() => {
              addBookmark();
            }}
          />
        </Tooltip>
        <Tooltip text="Toggle Lock On Scrubber (S)">
          <Button
            icon="pin"
            active={lockOnScrubber}
            onClick={() => {
              setLockOnScrubber(!lockOnScrubber);
            }}
          />
        </Tooltip>
        <div className="ml-auto"></div>
        <ButtonConnector>
          <Tooltip text="Play All Clips">
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
                <span>{toReadableTimeFromSeconds(lengthOfClips)}</span>
              </div>
            </Button>
          </Tooltip>
          <Tooltip text="Continue">
            <Button
              icon="arrow"
              onClick={async () => {
                await RecordingsManager.clip(video.videoPath, (clipsBar.noUiSlider?.get() as string[]).map(Number));
              }}
              disabled={renderBtnDisabled}
            />
          </Tooltip>
        </ButtonConnector>
      </div>
    </div>
  );
}
