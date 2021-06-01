<template>
  <div v-if="videoExists" ref="videoEditor" class="videoEditor">
    <video
      ref="videoPlayer"
      id="video"
      :src="'secfile://' + videoPath"
      @loadedmetadata="videoLoaded"
      @click="playPause"
    ></video>

    <!-- clipsBar connects are the only things the user can click on, on the timelineBar.
         So the user can only see this ContextMenu by right clicking on a clip. -->
    <ContextMenu ref="clipContextMenu" mountID="clipsBar">
      <ContextItem @click.native="removeClosestClip">
        Remove Clip
      </ContextItem>
    </ContextMenu>

    <div ref="timeline" class="timeline">
      <div ref="progressBar" id="progressBar" class="progressBar"></div>
      <div ref="clipsBar" id="clipsBar" class="clipsBar"></div>
    </div>

    <div class="controls">
      <Button @click="playPause" :icon="playPauseBtnIcon" />

      <Button
        :icon="volumeIcon"
        :slider="true"
        :sliderValue="volume"
        sliderMin="0"
        sliderMax="1"
        sliderStep="0.01"
        @slider-update="updateVolume"
        @click="toggleMute"
      />

      <Button
        :text="videoTimeReadable"
        :outlined="true"
        @click="showTimeAsElapsed ? (showTimeAsElapsed = false) : (showTimeAsElapsed = true)"
      />

      <Button text="Add Clip" @click="addClip" />

      <Button icon="add" @click="adjustZoom(true)" tooltip="Zoom In" />
      <Button icon="min2" @click="adjustZoom(false)" tooltip="Zoom Out" />

      <div class="rightFromHere"></div>

      <ButtonConnector>
        <Button :outlined="true" @click="playClips" tooltip="Play All Clips">
          <template slot="info">
            <div>
              <Icon i="clips" wh="18" />
              <span>{{ numberOfClips }}</span>
            </div>

            <div>
              <Icon i="time" wh="18" />
              <span>{{ lengthOfClips }}</span>
            </div>
          </template>
        </Button>

        <Button icon="arrow" :disabled="continueBtnDisabled" @click="saveClips" tooltip="Continue" />
      </ButtonConnector>
    </div>
  </div>
  <div v-else>
    <span>Video doesn't exist</span>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import Icon from "@/components/Icon.vue";
import ContextMenu from "@/components/context/ContextMenu.vue";
import ContextItem from "@/components/context/ContextItem.vue";
import Button from "@/components/ui/Button.vue";
import ButtonConnector from "@/components/ui/ButtonConnector.vue";
import "@/libs/helpers/extensions";
import Helpers from "@/libs/helpers";
import RecordingsManager from "@/libs/recorder/recordingsManager";
import fs from "fs";
import path from "path";
import noUiSlider, { PipsMode, target } from "nouislider";

@Component({
  components: {
    Icon,
    ContextMenu,
    ContextItem,
    Button,
    ButtonConnector
  }
})
export default class VideoPlayer extends Vue {
  @Prop({ required: true }) videoPath: string;

  private video: HTMLVideoElement;
  private videoEditor: target;
  private timelineBar: target;
  private progressBar: target;
  private clipsBar: target;

  numberOfClips = 0;
  lengthOfClips = "00:00";
  maxVideoTime = 0;
  playPauseBtnIcon = "play";
  continueBtnDisabled = true;
  volumeIcon = "volumeMax";
  volume = 0.8;
  showTimeAsElapsed = false;
  timelineZoom = 100;
  isPlayingAllClips = false;

  /**
   * Get current video time.
   */
  get currentVideoTime() {
    if (this.video != undefined) {
      return this.video.currentTime;
    } else {
      // If this.video is undefined, then it most-likely hasn't
      // loaded yet, so it's value will be 0 anyways.
      return 0;
    }
  }

  /**
   * Play/Pause the video.
   * @param userFired If function is being called by a user fired action.
   *                  If not it won't play/pause the video, but instead
   *                  just update the playPauseBtns icon to reflect the change.
   */
  playPause(userFired: boolean = true) {
    if (this.video.paused) {
      if (userFired) this.video.play();
      this.playPauseBtnIcon = "play";
    } else {
      if (userFired) this.video.pause();
      this.playPauseBtnIcon = "pause";
    }

    if (userFired) this.cancelPlayingClips();
  }

  /**
   * Update the volume for video.
   * @param volume Volume to set video to.
   */
  async updateVolume(volume: number) {
    // Update volume var used for volumeBars sliderValue
    // So the slider is updated on the volume button.
    this.volume = volume;

    // Try 3 times to update volume
    // First time volume is updated, the video element
    // hasn't loaded fully so we need to keep trying until it has.
    for (let i = 0; i < 3; ++i) {
      // Update volume if video element is defined
      if (this.video != undefined) {
        this.video.volume = volume;
        break;
      }

      await Helpers.sleep(250);
    }

    // Change volume icon depending on volume
    if (this.video.volume == 0) {
      this.volumeIcon = "volumeMute";
    } else if (this.video.volume < 0.5) {
      this.volumeIcon = "volumeMed";
    } else {
      this.volumeIcon = "volumeMax";
    }
  }

  /**
   * Toggle mute on video.
   */
  toggleMute() {
    if (this.video.volume > 0) {
      this.updateVolume(0);
    } else {
      this.updateVolume(0.5);
    }
  }

  /**
   * Initialize all components after video had loaded.
   */
  videoLoaded() {
    this.video = this.$refs.videoPlayer as HTMLVideoElement;
    this.videoEditor = this.$refs.videoEditor as target;
    this.timelineBar = this.$refs.timeline as target;
    this.progressBar = this.$refs.progressBar as target;
    this.clipsBar = this.$refs.clipsBar as target;

    this.maxVideoTime = this.video.duration;

    // Update volume once now, so default volume value is applied
    this.updateVolume(this.volume);

    this.video.addEventListener("play", () => this.playPause(false));
    this.video.addEventListener("pause", () => this.playPause(false));
    this.video.addEventListener("timeupdate", this.updateProgressBarTime);

    noUiSlider.create(this.progressBar, {
      start: [0],
      behaviour: "snap",
      animate: false,
      range: {
        min: 0,
        max: this.video.duration
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

    this.addTimelineBarEvents();
    this.addProgressBarEvents();
  }

  /**
   * Add events to timeline bar.
   */
  addTimelineBarEvents() {
    // Scroll across by using mouse wheel
    this.timelineBar.addEventListener("wheel", (e) => {
      let wheelUp = e.deltaY < 0;

      // If holding control, adjust zoom instead of scrolling
      if (e.ctrlKey) {
        if (wheelUp) {
          this.adjustZoom(true);
        } else {
          this.adjustZoom(false);
        }

        return;
      }

      if (wheelUp) {
        this.timelineBar.scrollBy(-50, 0);
      } else {
        this.timelineBar.scrollBy(50, 0);
      }
    });
  }

  /**
   * Update time on video element.
   * @param newTime Time to skip to.
   */
  updateVideoTime(newTime: number) {
    this.video.currentTime = newTime;
  }

  /**
   * Return video time in readable format.
   * Different format returned depending on `showTimeAsElapsed` var.
   */
  get videoTimeReadable() {
    if (this.showTimeAsElapsed) {
      return `${(this.maxVideoTime - this.currentVideoTime).toReadableTimeFromSeconds()} Left`;
    } else {
      return `${this.currentVideoTime.toReadableTimeFromSeconds()} / ${this.maxVideoTime.toReadableTimeFromSeconds()}`;
    }
  }

  /**
   * Update time on progress bar with current time on video.
   */
  updateProgressBarTime() {
    this.progressBar.noUiSlider!.set(this.video.currentTime);
  }

  /**
   * Adjust zoom up or down.
   * @param increase If should increase or decrease zoom.
   */
  adjustZoom(increase: boolean) {
    const min = 100;
    const max = 1000;

    // Increase/decrease `timelineZoom`
    if (increase && this.timelineZoom != max) {
      this.timelineZoom += 50;
    } else if (!increase && this.timelineZoom != min) {
      this.timelineZoom -= 50;
    }

    // Adjust width of bars
    this.progressBar.style.width = `${this.timelineZoom}%`;
    this.clipsBar.style.width = `${this.timelineZoom}%`;

    // Add/remove `zoomed` class on progressBar
    if (this.timelineZoom !== min) {
      this.videoEditor.classList.add("timelineZoomed");
    } else {
      this.videoEditor.classList.remove("timelineZoomed");
    }
  }

  /**
   * Re-add all events to progress bar.
   */
  addProgressBarEvents() {
    // First remove all events
    this.progressBar.noUiSlider!.off("");

    this.progressBar.noUiSlider!.on("slide", (_0: any, _1: any, unencoded: number[]) => {
      this.updateVideoTime(unencoded[0]);
    });

    this.progressBar.noUiSlider!.on("start", () => {
      this.video.removeEventListener("timeupdate", this.updateProgressBarTime);
      this.cancelPlayingClips();
    });

    this.progressBar.noUiSlider!.on("end", () => {
      this.video.addEventListener("timeupdate", this.updateProgressBarTime);
    });

    this.progressBar.addEventListener("dblclick", () => {
      this.addClip();
    });
  }

  /**
   * (Re)create clips bar with events.
   * @param starts Starts for slider. If set to an empty array, clipsBar is just destroyed.
   * @param connects Connects for slider.
   * @param tooltips Tooltips for slider.
   */
  createClipsBar(starts: number[], connects: boolean[], tooltips: boolean[]) {
    // If exists, destroy old clipsBar first
    if (this.clipsBar.noUiSlider) this.clipsBar.noUiSlider.destroy();

    if (starts.length > 0) {
      // Create new clipsBar with passed args
      noUiSlider.create(this.clipsBar, {
        start: starts,
        behaviour: "drag",
        connect: connects,
        tooltips: tooltips,
        range: {
          min: 0,
          max: this.video.duration
        }
      });

      // Add all events to new clipBar
      this.addClipsBarEvents();
    }

    // Update numberOfClips
    this.numberOfClips = tooltips.length / 2;
  }

  /**
   * Re-add all events to Clips bar
   */
  addClipsBarEvents() {
    let isDragging = false;

    // First remove all events
    this.clipsBar.noUiSlider!.off("");

    let connectElements = document.querySelectorAll(".clipsBar .noUi-connect");

    for (let i = 0, ii = 0; i < connectElements.length; ++i, ii += 2) {
      connectElements[i].addEventListener("dblclick", () => {
        this.removeClip(ii);
      });
    }

    this.clipsBar.noUiSlider!.on("update", (values: any, handle: any) => {
      this.updateTooltip(values, handle);
      this.updateTotalLengthOfClips(values);
    });

    this.clipsBar.noUiSlider!.on("slide", (values: any, handle: any) => {
      // Only do anything if user isn't dragging so we can avoid
      // running actions twice, since slide is also ran when dragging.
      if (!isDragging) {
        this.updateVideoTime(values[handle]);
      }
    });

    this.clipsBar.noUiSlider!.on("drag", (values: any, handle: any) => {
      isDragging = true;

      this.updateVideoTime(values[handle]);
    });

    // Show tooltip on drag
    this.clipsBar.noUiSlider!.on("start", (values: any, handle: any) => {
      // Also update tooltip on start, to avoid users seeing
      // it jump around if they dont drag right away (or never drag)
      this.updateTooltip(values, handle);

      this.getPairFromHandle(handle).tooltip.style.display = "block";

      this.cancelPlayingClips();
    });

    // Hide tooltip on finish drag
    this.clipsBar.noUiSlider!.on("end", (_: any, handle: any) => {
      isDragging = false;

      this.getPairFromHandle(handle).tooltip.style.display = "none";
    });
  }

  /**
   * Add clip at currentProgress/current position of progressBar handle.
   */
  addClip() {
    let starts = new Array<number>();
    let connects = new Array<boolean>();
    let tooltips = new Array<boolean>();
    let currentProgress = Number(this.progressBar.noUiSlider!.get());

    // If noUiSlider exists on clipsBar then update vars with actual values
    if (this.clipsBar.noUiSlider != undefined) {
      starts = (this.clipsBar.noUiSlider.get() as string[]).map(Number);
      connects = this.clipsBar.noUiSlider.options.connect! as boolean[];
      tooltips = this.clipsBar.noUiSlider.options.tooltips as boolean[];
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

    this.createClipsBar(starts, connects, tooltips);

    // Show continue button clip info
    this.continueBtnDisabled = false;
  }

  /**
   * Remove clip
   * @param connectIndex Index from 'clipsBar.noUiSlider.get()' array that relates
   *                     to the first handle bars value on the clip being removed.
   */
  removeClip(connectIndex: number) {
    let allHandleValues = (this.clipsBar.noUiSlider!.get() as string[]).map(Number);
    let handleValues = [allHandleValues[connectIndex], allHandleValues[connectIndex + 1]];

    let starts = (this.clipsBar.noUiSlider!.get() as string[]).map(Number);
    let connects = this.clipsBar.noUiSlider!.options.connect! as boolean[];
    let tooltips = this.clipsBar.noUiSlider!.options.tooltips as boolean[];

    // Remove all clips normally unless there is only one left,
    // in that case, reset starts, connects & tooltips so clipsBar gets destoryed.
    if (connects.length != 3) {
      // Remove starts from clip being removes
      starts = starts.removeFirst(handleValues[0]);
      starts = starts.removeFirst(handleValues[1]);

      // Remove last 3 connects then add false
      connects = connects.slice(0, connects.length - 3);
      connects.push(false);

      // Remove unneeded tooltips
      tooltips = tooltips.slice(0, tooltips.length - 2);
    } else {
      this.continueBtnDisabled = true;

      starts = [];
      connects = [];
      tooltips = [];

      // Reset length of clips
      this.updateTotalLengthOfClips([]);
    }

    this.createClipsBar(starts, connects, tooltips);
  }

  /**
   * Remove closest clip to cursors X position from MouseEvent data.
   * @param ev Data from mouse event.
   */
  removeClosestClip(ev: MouseEvent) {
    let handles = document.querySelectorAll<HTMLElement>(".clipsBar .noUi-origin .noUi-handle");
    let handleXs = new Array<number>();

    // Add x positions of handles to `handleXs` array
    for (let i = 0, n = handles.length; i < n; ++i) {
      handleXs.push(handles[i].getBoundingClientRect().x + 35);
    }

    // Get closest value in `handleXs` using pointer x from event
    var closestX = handleXs.reduce(function(prev, curr) {
      return Math.abs(curr - ev.clientX) < Math.abs(prev - ev.clientX) ? curr : prev;
    });

    // Get handleIndex, if even number minus one to get first handle in clip
    let handleIndex = handleXs.indexOf(closestX);
    if (handleIndex % 2) --handleIndex;

    this.removeClip(handleIndex);
  }

  /**
   * Return values from clipsBar in a multidimensional array, each being a clip start and end values.
   */
  getAllClips() {
    let clips = [];

    if (this.clipsBar.noUiSlider != undefined) {
      let clipsBarValues = (this.clipsBar.noUiSlider!.get() as string[]).map(Number);
      let i = 0;
      let n = clipsBarValues.length;

      while (i < n) {
        clips.push(clipsBarValues.slice(i, (i += 2)));
      }
    }

    return clips;
  }

  /**
   * Play all clips currently created on clipsBar.
   */
  async playClips() {
    this.isPlayingAllClips = true;
    let clips = this.getAllClips();

    for (let i = 0, n = clips.length; i < n; ++i) {
      // Clip start and end times
      let start = clips[i][0];
      let end = clips[i][1];

      // Skip to start of clip and play
      this.updateVideoTime(start);
      this.video.play();

      // Play clip until we reach `end` or playing is cancelled.
      let cp = await new Promise((resolve) => {
        const u = () => {
          // If an action somewhere else has changed `isPlayingAllClips` to false,
          // then don't continue after sleep.
          if (!this.isPlayingAllClips) {
            this.video.removeEventListener("timeupdate", u);

            return resolve("cancelled");
          }

          // If video time has past or is equal to end time, carry on to next clip.
          if (this.video.currentTime >= end) {
            this.video.pause();
            this.video.removeEventListener("timeupdate", u);

            resolve("finished");
          }
        };

        this.video.addEventListener("timeupdate", u);
      });

      // If promise above was cancelled, return as to not continue playing clips.
      if (cp == "cancelled") return;
    }

    this.isPlayingAllClips = false;
  }

  /**
   * Cancel playing all clips.
   */
  cancelPlayingClips() {
    this.isPlayingAllClips = false;
  }

  /**
   * Save all clips.
   */
  saveClips() {
    RecordingsManager.clip(this.videoPath, (this.clipsBar.noUiSlider!.get() as string[]).map(Number));
  }

  /**
   * Update total length of clips.
   * @param values String array of values from slider.
   */
  updateTotalLengthOfClips(values: string[]) {
    let totalLength = 0;
    let v = values.map(Number);

    // Loop over values in pairs
    for (let i = 0, n = v.length; i < n; i += 2) {
      // Update totalLength after calculating current pairs length
      totalLength += Number((v[i + 1] - v[i]).toFixed(0));
    }

    // Finally, update actual lengthOfClips variable
    this.lengthOfClips = totalLength.toReadableTimeFromSeconds();
  }

  /**
   * Update tooltip to show time in readable format.
   * Changes tooltips text by using .innerHTML so that the tooltips
   * values returned by are not altered by using the formatter.
   */
  updateTooltip(values: any, handle: any) {
    let pair = this.getPairFromHandle(handle);

    // Set tooltip position
    pair.tooltip.style.left = `${(pair.connect.getBoundingClientRect().width + 8) / 2}px`;

    // Set tooltip value to clip length
    pair.tooltip.innerHTML = Number(
      (parseFloat(values[pair.handle + 1]) - parseFloat(values[pair.handle])).toFixed(0)
    ).toReadableTimeFromSeconds();
  }

  /**
   * Get tooltip and connect pair from the handle.
   * @param handle Handle that is connected to pair
   */
  getPairFromHandle(handle: number) {
    let tooltips: Array<HTMLElement | Boolean> = this.clipsBar.noUiSlider!.getTooltips() as [HTMLElement | Boolean];
    let tooltip: HTMLElement;

    if (tooltips[handle] instanceof HTMLElement) {
      tooltip = tooltips[handle] as HTMLElement;
    } else {
      handle = handle - 1;
      tooltip = tooltips[handle] as HTMLElement;
    }

    let connects = document.querySelectorAll<HTMLElement>(".clipsBar .noUi-connect");
    let connect = connects.item(tooltips.filter((e: any) => e != false).indexOf(tooltip));

    return {
      tooltip: tooltip,
      connect: connect,
      handle: handle
    };
  }

  /**
   * Check if videoPath exists and has a supported extension (mp4, mkv, etc)
   */
  get videoExists() {
    if (fs.existsSync(this.videoPath)) {
      return path.extname(this.videoPath).equalsAnyOf([".mp4", ".mkv", ".webm"]);
    }

    return false;
  }
}
</script>

<style lang="scss">
.videoEditor {
  width: 100%;
  height: 100%;
  overflow-x: hidden;

  video {
    width: 100%;
    height: calc(100% - 90px); // Make height of video all take up all blank space on page
    outline: none;
    background-color: black;
  }

  .controls {
    display: flex;
    align-items: center;
    margin: 5px;
    height: 34px;

    // From which div to move items to right of container
    .rightFromHere {
      margin-left: auto;
    }
  }

  &.timelineZoomed {
    video {
      height: calc(100% - 95px); // Make height of video all take up all blank space on page
    }

    .timeline {
      height: 45px;
      overflow-y: hidden;
      overflow-x: auto;

      &::-webkit-scrollbar {
        height: 5px;
      }

      &::-webkit-scrollbar-track {
        background-color: $primaryColor;
      }

      .clipsBar {
        .noUi-tooltip {
          bottom: -5%;
          height: 25px;
          background-color: $lightHoverColor;
          border: unset;
          box-shadow: unset;
          font-weight: bold;
          text-shadow: 1px 1px black;
        }
      }
    }
  }

  .timeline {
    width: 100%;
    height: 40px;
    padding: 0 10px;
    background-color: $secondaryColor;

    .progressBar {
      height: 100%;
      background-color: $secondaryColor;

      .noUi-handle {
        top: 0;
        height: 40px;
      }

      .noUi-tooltip {
        transition: left 100ms ease-in;
      }

      .noUi-pips {
        top: 12px;
        height: unset;
        padding: unset;

        .noUi-marker {
          display: none;
        }

        .noUi-value {
          transform: translateX(-50%);

          &:nth-child(2) {
            transform: translateX(-10%);
          }

          &:last-child {
            transform: translateX(-90%);
            margin-right: 1px;
          }
        }
      }
    }

    .clipsBar {
      position: relative;
      top: -100%;
      height: 100%;
      background-color: transparent;

      .noUi-origin {
        &:nth-child(even) .noUi-handle {
          background-color: rgba(255, 255, 255, 0.1);
          border-right: unset;
        }

        &:nth-child(odd) .noUi-handle {
          background-color: rgba(255, 255, 255, 0.1);
          border-left: unset;
        }
      }

      .noUi-base {
        pointer-events: none;
      }

      .noUi-draggable {
        background-color: transparent;
        border-top: 1px solid $textPrimary;
        border-bottom: 1px solid $textPrimary;
        border-radius: unset;
        top: 7px;
        height: 25px;
        pointer-events: all;
      }

      .noUi-handle {
        top: 7px;
        height: 25px;
        border-radius: 0px;
        pointer-events: all;
      }

      .noUi-tooltip {
        display: none;
        bottom: 165%;
        pointer-events: none;
      }
    }
  }
}
</style>
