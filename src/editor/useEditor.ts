/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { useEffect, useState } from "react";
import noUiSlider, { PipsMode, type target } from "nouislider";
import { toReadableTimeFromSeconds } from "@/libs/helpers/extensions/number";
import { removeFirst } from "@/libs/helpers/extensions/array";
import { logger } from "@/libs/logger";

export default function useEditor(
  playerRef: React.RefObject<HTMLVideoElement>,
  timelineRef: React.RefObject<HTMLDivElement>,
  progressBarRef: React.RefObject<HTMLDivElement>,
  clipsBarRef: React.RefObject<HTMLDivElement>,
  bookmarksBarRef: React.RefObject<HTMLDivElement>,
  initialVolume: number,
  onBookmarkAdded: (b: number) => void,
  onBookmarkRemoved: (b: number) => void,
  initialBookmarks: number[] | undefined
) {
  const [playBtnIcon, setPlayBtnIcon] = useState<"play" | "pause">("play");
  const [volume, setVolume] = useState<number>(0.8);
  const [volumeIcon, setVolumeIcon] = useState<"volumeMute" | "volumeMed" | "volumeMax">("volumeMax");
  const [videoTimeReadable, setVideoTimeReadable] = useState<string>("00:00 / 00:00");
  const [showTimeAsElapsed, setShowTimeAsElapsed] = useState<boolean>(false);
  const [playerCurTime, setPlayerCurTime] = useState<number>(0);
  const [numberOfClips, setNumberOfClips] = useState<number>(0);
  const [lengthOfClips, setLengthOfClips] = useState<number>(0);
  const [renderBtnDisabled, setRenderBtnDisabled] = useState<boolean>(true);
  const [isPlayingClips, setIsPlayingClips] = useState<boolean>(false); // Setting this to false will ensure clip playing stops
  const [timelineZoom, setTimelineZoom] = useState<number>(100);
  const [lockOnScrubber, setLockOnScrubber] = useState<boolean>(false);

  let player = playerRef.current!;
  let timeline = timelineRef.current!;
  let progressBar = progressBarRef.current! as target;
  let clipsBar = clipsBarRef.current! as target;
  let bookmarksBar = bookmarksBarRef.current! as target;

  useEffect(() => {
    player = playerRef.current!;
    timeline = timelineRef.current!;
    progressBar = progressBarRef.current!;
    clipsBar = clipsBarRef.current!;
    bookmarksBar = bookmarksBarRef.current!;

    if (player && progressBar) {
      player.addEventListener("loadedmetadata", videoLoaded);
      player.addEventListener("play", updatePlayBtnIcon);
      player.addEventListener("pause", updatePlayBtnIcon);
      player.addEventListener("timeupdate", videoTimeUpdate);
      timeline.addEventListener("click", timelineClick);

      return () => {
        player.removeEventListener("loadedmetadata", videoLoaded);
        player.removeEventListener("play", updatePlayBtnIcon);
        player.removeEventListener("pause", updatePlayBtnIcon);
        player.removeEventListener("timeupdate", videoTimeUpdate);
        timeline.removeEventListener("click", timelineClick);
      };
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keyup", keybindHandler);

    return () => {
      window.removeEventListener("keyup", keybindHandler);
    };
  }, [timelineZoom, volume, lockOnScrubber]);

  // Update when playerCurTime/showTimeAsElapsed changes.
  // Currently updates the readable video time and includes lockOnScrubber functionality.
  useEffect(() => {
    updateVideoTimeReadable();

    if (!player.paused && lockOnScrubber) {
      const scrubber = progressBar.noUiSlider?.getOrigins()[0].querySelector(".noUi-handle");
      if (scrubber) {
        timeline.scrollTo({
          left: timeline.scrollLeft + scrubber.getBoundingClientRect().x - timeline.getBoundingClientRect().width / 2
        });
      }
    }
  }, [playerCurTime, showTimeAsElapsed]);

  useEffect(() => {
    // Setting is-playing-clips attribute on the player element as a
    // workaround to the `isPlayingClips` state not updating within the promise.
    // This allows us to get an update to this value in the promise and stop is early if needed.
    if (isPlayingClips) {
      player.setAttribute("is-playing-clips", "true");
    } else {
      player.setAttribute("is-playing-clips", "false");
    }
  }, [isPlayingClips]);

  useEffect(() => {
    timeline.addEventListener("wheel", timelineWheel);

    return () => {
      timeline.removeEventListener("wheel", timelineWheel);
    };
  }, [timelineZoom]);

  /**
   * EV HANDLER
   */
  const videoLoaded = () => {
    logger.info("Editor", "VIDEO LOADED");
    updateVolume(initialVolume); // Set default volume and icon
    updateVideoTimeReadable();

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
              return toReadableTimeFromSeconds(value);
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
        setIsPlayingClips(false);
      });

      progressBar.noUiSlider!.on("end", () => {
        player.addEventListener("timeupdate", updateProgressBarTime);
      });

      progressBar.addEventListener("dblclick", () => {
        addClip();
      });
    }

    if (initialBookmarks && initialBookmarks.length > 0 && !bookmarksBar.classList.contains("noUi-target")) {
      createBookmarksBar(initialBookmarks);
    }

    // When a bookmark is right clicked, remove.
    // Pointer events are disabled everywhere except handles.
    bookmarksBar.removeEventListener("mouseup", bookmarksBarMouseUp);
    bookmarksBar.addEventListener("mouseup", bookmarksBarMouseUp);
  };

  /**
   * Disable lock on scrubber if user clicks on timeline.
   */
  const timelineClick = () => {
    if (!player.paused) setLockOnScrubber(false);
  };

  /**
   * EV HANDLER
   */
  const videoTimeUpdate = () => {
    setPlayerCurTime(player.currentTime);
    updateProgressBarTime();
  };

  /**
   * Timeline wheel event handler.
   */
  const timelineWheel = (e: WheelEvent) => {
    const wheelUp = e.deltaY < 0;

    // If holding control, adjust zoom instead of scrolling
    if (e.ctrlKey) {
      if (wheelUp) {
        adjustZoom(true);
      } else {
        adjustZoom(false);
      }

      return;
    }

    if (wheelUp) {
      timeline.scrollBy(-50, 0);
    } else {
      timeline.scrollBy(50, 0);
    }
  };

  const keybindHandler = (e: KeyboardEvent) => {
    // If target is any element other than an input, then let keybind work
    if (!(e.target instanceof HTMLInputElement)) {
      switch (e.code) {
        case "Space": {
          playPause();
          break;
        }

        case "ArrowRight": {
          skipVideo(5);
          break;
        }

        case "ArrowLeft": {
          skipVideo(-5);
          break;
        }

        case "ArrowUp": {
          updateVolume(player.volume + 0.1);
          break;
        }

        case "ArrowDown": {
          updateVolume(player.volume - 0.1);
          break;
        }

        case "KeyC": {
          if (e.ctrlKey) {
            removeClipAtScrubber();
          } else {
            addClip();
          }
          break;
        }

        case "KeyM": {
          toggleMute();
          break;
        }

        case "KeyS": {
          setLockOnScrubber(!lockOnScrubber);
          break;
        }

        case "KeyX": {
          adjustZoom(false);
          break;
        }

        case "KeyZ": {
          adjustZoom(true);
          break;
        }

        case "KeyB": {
          addBookmark();
          break;
        }
      }
    }
  };

  /**
   * (Re)create clips bar with events.
   * @param starts Starts for slider. If set to an empty array, clipsBar is just destroyed.
   * @param connects Connects for slider.
   * @param tooltips Tooltips for slider.
   */
  const createClipsBar = (starts: number[], connects: boolean[], tooltips: boolean[]) => {
    // If exists, destroy old clipsBar first
    if (clipsBar.noUiSlider) clipsBar.noUiSlider.destroy();

    if (starts.length > 0) {
      logger.info("Editor", "createClipsBar", starts, connects, tooltips);
      // Create new clipsBar with passed args
      noUiSlider.create(clipsBar, {
        start: starts,
        behaviour: "drag",
        connect: connects,
        tooltips,
        range: {
          min: 0,
          max: player.duration
        }
      });

      // Add all events to new clipBar
      addClipsBarEvents();
    }

    // Update numberOfClips
    setNumberOfClips(tooltips.length / 2);
  };

  /**
   * Re-add all events to Clips bar
   */
  const addClipsBarEvents = () => {
    let isDragging = false;

    // First remove all events
    clipsBar.noUiSlider!.off("");

    const connectElements = document.querySelectorAll(".clipsBar .noUi-connect");

    for (let i = 0, ii = 0; i < connectElements.length; ++i, ii += 2) {
      connectElements[i].addEventListener("dblclick", () => {
        removeClip(ii);
      });
    }

    clipsBar.noUiSlider!.on("update", (values: any, handle: any) => {
      updateTooltip(values, handle);

      // Update length of clips state
      let totalLength = 0;
      const v = values.map(Number);
      // Loop over values in pairs
      for (let i = 0, n = v.length; i < n; i += 2) {
        // Update totalLength after calculating current pairs length
        totalLength += Number((v[i + 1] - v[i]).toFixed(0));
      }
      // Finally, update actual lengthOfClips state
      setLengthOfClips(totalLength);
    });

    clipsBar.noUiSlider!.on("slide", (values: any, handle: any) => {
      // Only do anything if user isn't dragging so we can avoid
      // running actions twice, since slide is also ran when dragging.
      if (!isDragging) {
        updateVideoTime(values[handle]);
      }
    });

    clipsBar.noUiSlider!.on("drag", (values: any, handle: any) => {
      isDragging = true;
      updateVideoTime(values[handle]);
    });

    // Show tooltip on drag
    clipsBar.noUiSlider!.on("start", (values: any, handle: any) => {
      // Also update tooltip on start, to avoid users seeing
      // it jump around if they dont drag right away (or never drag)
      updateTooltip(values, handle);
      getPairFromHandle(handle).tooltip.style.display = "block";
      setIsPlayingClips(false);
    });

    // Hide tooltip on finish drag
    clipsBar.noUiSlider!.on("end", (_: any, handle: any) => {
      isDragging = false;
      getPairFromHandle(handle).tooltip.style.display = "none";
    });
  };

  /**
   * Add clip at currentProgress/current position of progressBar handle.
   */
  const addClip = () => {
    let starts = new Array<number>();
    let connects = new Array<boolean>();
    let tooltips = new Array<boolean>();
    const currentProgress = Number(progressBar.noUiSlider!.get());

    // If noUiSlider exists on clipsBar then update vars with actual values
    if (clipsBar.noUiSlider !== undefined) {
      starts = (clipsBar.noUiSlider.get() as string[]).map(Number);
      connects = clipsBar.noUiSlider.options.connect! as boolean[];
      tooltips = clipsBar.noUiSlider.options.tooltips as boolean[];
    }

    // Remove last connect, then add connects
    // for new starts and add 'false' back to end.
    connects.pop();
    connects.push(false, true, false);

    // Add tooltips to new connects
    tooltips.push(true, false);

    // Add new starts and then sort the array.
    // CAN'T have array as [100, 200, 50, 80].
    starts.push(currentProgress, currentProgress + 5);
    starts.sort((a, b) => a - b);

    createClipsBar(starts, connects, tooltips);

    // Show continue button clip info
    setRenderBtnDisabled(false);
  };

  /**
   * Remove clip
   * @param connectIndex Index from 'clipsBar.noUiSlider.get()' array that relates
   *                     to the first handle bars value on the clip being removed.
   */
  const removeClip = (connectIndex: number) => {
    const allHandleValues = (clipsBar.noUiSlider!.get() as string[]).map(Number);
    const handleValues = [allHandleValues[connectIndex], allHandleValues[connectIndex + 1]];

    let starts = (clipsBar.noUiSlider!.get() as string[]).map(Number);
    let connects = clipsBar.noUiSlider!.options.connect! as boolean[];
    let tooltips = clipsBar.noUiSlider!.options.tooltips as boolean[];

    // Remove all clips normally unless there is only one left,
    // in that case, reset starts, connects & tooltips so clipsBar gets destoryed.
    if (connects.length !== 3) {
      // Remove starts from clip being removes
      starts = removeFirst(starts, handleValues[0]);
      starts = removeFirst(starts, handleValues[1]);

      // Remove last 3 connects then add false
      connects = connects.slice(0, connects.length - 3);
      connects.push(false);

      // Remove unneeded tooltips
      tooltips = tooltips.slice(0, tooltips.length - 2);
    } else {
      setRenderBtnDisabled(true);

      starts = [];
      connects = [];
      tooltips = [];

      // Reset length of clips
      setLengthOfClips(0);
    }

    createClipsBar(starts, connects, tooltips);
  };

  /**
   * Remove clip at scrubber.
   */
  const removeClipAtScrubber = () => {
    // Get handle closest to currentTime on player
    const handles = (clipsBar.noUiSlider!.get() as string[]).map(Number);
    const target = player.currentTime;
    let closest = 0; // index
    if (handles) {
      for (let i = 0; i < handles.length; i++) {
        const handle = handles[i];
        if (Math.abs(handles[closest] - target) > Math.abs(handle - target)) {
          closest = i;
        }
      }
    }

    // Get first handle value to give to removeClip()
    const firstHandle = closest % 2 ? closest - 1 : closest;

    // Make sure scrubber is between clip start and end bounds
    if (target > handles[firstHandle] && target < handles[firstHandle + 1]) removeClip(firstHandle);
  };

  /**
   * Return values from clipsBar in a multidimensional array, each being a clip start and end values.
   */
  const getAllClips = () => {
    const clips = [];

    if (clipsBar.noUiSlider !== undefined) {
      const clipsBarValues = (clipsBar.noUiSlider.get() as string[]).map(Number);
      let i = 0;
      const n = clipsBarValues.length;

      while (i < n) {
        clips.push(clipsBarValues.slice(i, (i += 2)));
      }
    }

    return clips;
  };

  /**
   * Play all clips currently created on clipsBar.
   */
  const playClips = async () => {
    // Cancel playing clips if already playing
    if (isPlayingClips) {
      setIsPlayingClips(false);
      player.pause();
      return;
    }

    setIsPlayingClips(true);

    const clips = getAllClips();

    for (let i = 0, n = clips.length; i < n; ++i) {
      // Clip start and end times
      const start = clips[i][0];
      const end = clips[i][1];

      // Skip to start of clip and play
      updateVideoTime(start);
      await player.play();

      // Play clip until we reach `end` or playing is cancelled.
      const cp = await new Promise((resolve) => {
        const u = () => {
          // If an action somewhere else has changed `isPlayingAllClips` to false,
          // then don't continue.
          if (player.getAttribute("is-playing-clips") === "false") {
            player.removeEventListener("timeupdate", u);
            resolve("cancelled");
          }

          // If video time has past or is equal to end time, carry on to next clip.
          if (player.currentTime >= end && player.currentTime <= end + 3) {
            player.pause();
            player.removeEventListener("timeupdate", u);

            resolve("finished");
          }
        };

        player.addEventListener("timeupdate", u);
      });

      // If promise above was cancelled, return as to not continue playing clips.
      if (cp === "cancelled") return;
    }

    setIsPlayingClips(false);
  };

  /**
   * Update tooltip to show time in readable format.
   * Changes tooltips text by using .innerHTML so that the tooltips
   * values returned by are not altered by using the formatter.
   */
  const updateTooltip = (values: any, handle: any) => {
    const pair = getPairFromHandle(handle);

    // Set tooltip position
    pair.tooltip.style.left = `${(pair.connect.getBoundingClientRect().width + 8) / 2}px`;

    // Set tooltip value to clip length
    pair.tooltip.innerHTML = toReadableTimeFromSeconds(
      Number((parseFloat(values[pair.handle + 1]) - parseFloat(values[pair.handle])).toFixed(0))
    );
  };

  /**
   * Get tooltip and connect pair from the handle.
   * @param handle Handle that is connected to pair
   */
  const getPairFromHandle = (handle: number) => {
    const tooltips: Array<HTMLElement | boolean> = clipsBar.noUiSlider!.getTooltips() as [HTMLElement | boolean];
    let tooltip: HTMLElement;

    if (tooltips[handle] instanceof HTMLElement) {
      tooltip = tooltips[handle] as HTMLElement;
    } else {
      handle = handle - 1;
      tooltip = tooltips[handle] as HTMLElement;
    }

    const connects = document.querySelectorAll<HTMLElement>(".clipsBar .noUi-connect");
    const connect = connects.item(tooltips.filter((e: any) => e !== false).indexOf(tooltip));

    return {
      tooltip,
      connect,
      handle
    };
  };

  const createBookmarksBar = (starts: number[]) => {
    if (bookmarksBar.noUiSlider) bookmarksBar.noUiSlider.destroy();

    if (starts.length > 0) {
      starts.sort((a, b) => a - b);
      console.log("createBookmarksBar:", starts);
      noUiSlider.create(bookmarksBar, {
        start: starts,
        behaviour: "snap",
        animate: false,
        range: {
          min: 0,
          max: player.duration
        }
      });
      // Disable dragging bookmarks
      bookmarksBar.noUiSlider!.disable();
    }
  };

  const bookmarksBarMouseUp = (ev: MouseEvent) => {
    if (ev.button === 2) {
      console.log("bookmarksBarMouseUp", ev);
      const handle = ev.composedPath()[1] as HTMLDivElement;
      if (handle) {
        const handleN = handle.getAttribute("data-handle");
        if (!handleN) {
          console.error("failed to find data-handle attribute", handleN);
          return;
        }
        removeBookmark(Number(handleN));
      }
    }
  };

  const addBookmark = () => {
    const currentProgress = Number(progressBar.noUiSlider!.get());
    let starts = new Array<number>();
    if (bookmarksBar.noUiSlider) {
      const s = bookmarksBar.noUiSlider.get();
      if (typeof s === "object") {
        starts = (s as string[]).map(Number);
      } else {
        starts = [Number(s)];
      }
    }
    if (starts.includes(currentProgress)) {
      console.log("addBookmark: bookmark already exists at time:", currentProgress);
      return;
    }
    starts.push(currentProgress);
    createBookmarksBar(starts);
    onBookmarkAdded(currentProgress);
  };

  const removeBookmark = (handleToRemove: number) => {
    if (!bookmarksBar.noUiSlider) {
      console.error("removeBookmark: nouislider not found on bookmarks bar");
      return;
    }
    let bookmarkToRemoveTime: number;
    const s = bookmarksBar.noUiSlider.get();
    let starts = new Array<number>();
    console.log("removeBookmark: starts:", s);
    // If array, remove the one handle,
    // if not, must only have one handle left, so we can pass the empty starts array.
    if (typeof s === "object") {
      starts = (s as string[]).map(Number);
      bookmarkToRemoveTime = starts[handleToRemove];
      starts = removeFirst(starts, bookmarkToRemoveTime);
    } else {
      bookmarkToRemoveTime = Number(s);
    }
    console.log("removeBookmark: bookmark time:", bookmarkToRemoveTime);
    createBookmarksBar(starts);
    onBookmarkRemoved(bookmarkToRemoveTime);
  };

  const toggleShowTimeAsElapsed = () => {
    setShowTimeAsElapsed(!showTimeAsElapsed);
  };

  const updateVideoTimeReadable = () => {
    const maxVideoTime = player.duration;
    if (showTimeAsElapsed) {
      setVideoTimeReadable(`${toReadableTimeFromSeconds(maxVideoTime - playerCurTime)} Left`);
    } else {
      setVideoTimeReadable(`${toReadableTimeFromSeconds(playerCurTime)} / ${toReadableTimeFromSeconds(maxVideoTime)}`);
    }
  };

  /**
   * Update time on video element.
   * @param newTime Time to skip to.
   */
  const updateVideoTime = (newTime: number) => {
    player.currentTime = newTime;
  };

  /**
   * Skip video forward or back.
   * @param s Time in seconds to skip forwards or backwards (negative number for backwards).
   */
  const skipVideo = (s: number) => {
    updateVideoTime(player.currentTime + s);
  };

  /**
   * Update time on progress bar with current time on video.
   */
  const updateProgressBarTime = () => {
    progressBar.noUiSlider!.set(player.currentTime);
  };

  const updatePlayBtnIcon = (ev: Event) => {
    if (ev.type === "play") setPlayBtnIcon("pause");
    else setPlayBtnIcon("play");
  };

  const playPause = () => {
    if (player.paused) {
      void player.play();
    } else {
      player.pause();
    }
  };

  const updateVolume = (vol: number) => {
    // Don't allow number to be smaller than 0 or bigger than 1
    if (vol < 0) vol = 0;
    else if (vol > 1) vol = 1;

    setVolume(vol);
    player.volume = vol;

    // Change volume icon depending on volume
    if (vol === 0) {
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
      return 0;
    } else {
      updateVolume(0.5);
      return 0.5;
    }
  };

  /**
   * Adjust zoom up or down.
   * @param increase If should increase or decrease zoom.
   */
  const adjustZoom = (increase: boolean) => {
    const min = 100;
    const max = 1000;
    let newZoom;

    // Increase/decrease `timelineZoom`
    if (increase && timelineZoom !== max) {
      newZoom = timelineZoom + 50;
      setTimelineZoom(newZoom);
    } else if (!increase && timelineZoom !== min) {
      newZoom = timelineZoom - 50;
      setTimelineZoom(newZoom);
    }

    logger.info("Editor", increase, newZoom, timelineZoom);

    if (newZoom) {
      // Adjust width of bars
      progressBar.style.width = `${newZoom}%`;
      clipsBar.style.width = `${newZoom}%`;
      bookmarksBar.style.width = `${newZoom}%`;

      // Add/remove `zoomed` class on progressBar
      if (newZoom > min) {
        timeline.classList.add("zoomed");
      } else {
        timeline.classList.remove("zoomed");
      }
    }
  };

  return {
    clipsBar,
    playBtnIcon,
    playPause,
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
  };
}
