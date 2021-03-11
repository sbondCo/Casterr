<template>
  <div v-if="videoExists" class="videoPlayerContainer">
    <video
      ref="videoPlayer"
      id="video"
      :src="'secfile://' + videoPath"
      @loadedmetadata="videoLoaded"
      @click="playPause"
    ></video>

    <div class="progressBarContainer">
      <div ref="progressBar" class="progressBar"></div>
      <div ref="clipsBar" class="clipsBar"></div>
    </div>

    <div class="controls">
      <Button @click="playPause" :icon="playPauseBtnIcon" />

      <Button icon="volumeMax" :slider="true" @update="updateVolume" />

      <Button :text="`${currentVideoTime} / ${maxVideoTime}`" :outlined="true" />

      <Button text="ADD CLIP" @click="addClip" />

      <Button
        class="rightFromHere"
        icon="arrow"
        :combinedInfo="continueBtnCI"
        :disabled="!continueBtnCI"
        @click="saveClips"
      >
        <div>
          <Icon i="clips" wh="18" />
          <span>{{ numberOfClips }}</span>
        </div>

        <div>
          <Icon i="time" wh="18" />
          <span>{{ lengthOfClips }}</span>
        </div>
      </Button>
    </div>
  </div>
  <div v-else>
    <span>Video doesn't exist</span>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import Icon from "./../components/Icon.vue";
import Button from "./../components/ui/Button.vue";
import "./../libs/helpers/extensions";
import Helpers from "./../libs/helpers";
import RecordingsManager from "./../libs/recorder/recordingsManager";
import fs from "fs";
import path from "path";
import noUiSlider from "nouislider";

@Component({
  components: {
    Icon,
    Button
  }
})
export default class VideoPlayer extends Vue {
  @Prop({ required: true }) videoPath: string;

  private video: HTMLVideoElement;
  private progressBar: noUiSlider.Instance;
  private clipsBar: noUiSlider.Instance;

  numberOfClips = 0;
  lengthOfClips = "00:00";
  currentVideoTime = "00:00";
  maxVideoTime = "00:00";
  playPauseBtnIcon = "play";
  continueBtnCI = false;

  /**
   * Play/Pause the video.
   * @param fromButton If function is being called by playPauseBtn.
   *                   If not it won't play/pause the video, but instead
   *                   just update the playPauseBtns icon to reflect the change.
   */
  playPause(fromButton: boolean = true) {
    if (this.video.paused) {
      if (fromButton) this.video.play();
      this.playPauseBtnIcon = "play";
    } else {
      if (fromButton) this.video.pause();
      this.playPauseBtnIcon = "pause";
    }
  }

  /**
   * Update the volume for video.
   * @param volume Volume to set video to.
   */
  async updateVolume(volume: number) {
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
  }

  /**
   * Initialize all components after video had loaded.
   */
  videoLoaded() {
    this.video = this.$refs.videoPlayer as HTMLVideoElement;
    this.progressBar = this.$refs.progressBar as noUiSlider.Instance;
    this.clipsBar = this.$refs.clipsBar as noUiSlider.Instance;

    this.maxVideoTime = this.video.duration.toReadableTimeFromSeconds();

    this.video.addEventListener("play", () => {
      this.playPause(false);
    });
    this.video.addEventListener("pause", () => {
      this.playPause(false);
    });
    this.video.addEventListener("timeupdate", this.updateProgressBarTime);

    noUiSlider.create(this.progressBar, {
      start: [0],
      behaviour: "snap",
      range: {
        min: 0,
        max: this.video.duration // + 99999
      },
      pips: {
        mode: "count",
        values: 10,
        format: {
          to: (value: number) => {
            // Show readable time on pip values
            return value.toReadableTimeFromSeconds();
          }
        }
      }
    });

    this.addProgressBarEvents();
  }

  /**
   * Update time on video element
   */
  updateVideoTime(newTime: number) {
    this.video.currentTime = newTime;
    this.currentVideoTime = this.video.currentTime.toReadableTimeFromSeconds();
  }

  /**
   * Update time on progress bar
   */
  updateProgressBarTime() {
    this.progressBar.noUiSlider.set(this.video.currentTime);
    this.currentVideoTime = this.video.currentTime.toReadableTimeFromSeconds();
  }

  /**
   * Re-add all events to Progress bar
   */
  addProgressBarEvents() {
    // First remove all events
    this.progressBar.noUiSlider.off();

    this.progressBar.noUiSlider.on("slide", (values: any[]) => {
      this.updateVideoTime(values[0]);
    });

    this.progressBar.noUiSlider.on("start", () => {
      this.video.removeEventListener("timeupdate", this.updateProgressBarTime);
    });

    this.progressBar.noUiSlider.on("end", () => {
      this.video.addEventListener("timeupdate", this.updateProgressBarTime);
    });

    this.progressBar.addEventListener("dblclick", () => {
      this.addClip();
    });
  }

  /**
   * (Re)create clips bar with events.
   */
  createClipsBar(starts: number[], connects: boolean[], tooltips: boolean[]) {
    // If exists, destroy old clipsBar first
    if (this.clipsBar.noUiSlider) this.clipsBar.noUiSlider.destroy();

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

    // Update numberOfClips
    this.numberOfClips = this.clipsBar.noUiSlider.getTooltips().length / 2;
  }

  /**
   * Re-add all events to Clips bar
   */
  addClipsBarEvents() {
    // First remove all events
    this.clipsBar.noUiSlider.off();

    let connectElements = document.querySelectorAll(".clipsBar .noUi-connect");

    for (let i = 0, ii = 0; i < connectElements.length; ++i, ii += 2) {
      connectElements[i].addEventListener("dblclick", () => {
        this.removeClip(ii);
      });
    }

    this.clipsBar.noUiSlider.on("update", (values: any, handle: any) => {
      this.updateTooltip(values, handle);
      this.updateTotalLengthOfClips(values);
    });

    // Show tooltip on drag
    this.clipsBar.noUiSlider.on("start", (_, handle: any) => {
      this.getPairFromHandle(handle).tooltip.style.display = "block";
    });

    // Hide tooltip on finish drag
    this.clipsBar.noUiSlider.on("end", (_, handle: any) => {
      this.getPairFromHandle(handle).tooltip.style.display = "none";
    });
  }

  /**
   * Add clip at currentProgress/current position of progressBar handle
   */
  addClip() {
    let starts = new Array<number>();
    let connects = new Array<boolean>();
    let tooltips = new Array<boolean>();
    let currentProgress = Number(this.progressBar.noUiSlider.get());

    // If noUiSlider exists on clipsBar then update vars with actual values
    if (this.clipsBar.noUiSlider != undefined) {
      starts = (this.clipsBar.noUiSlider.get() as string[]).map(Number);
      connects = this.clipsBar.noUiSlider.options.connect! as boolean[];
      tooltips = this.clipsBar.noUiSlider.options.tooltips as boolean[];
    }

    // Update connects/tooltips only if:
    //  - There isn't only one clip (if connects length is 3 then there is only 1 clip)
    //  - The clips bar is visible (if clipsBar visibility == "" then assume it is visible)
    // This is because we are going to reuse the old connects/tooltips when adding 1st clip again.
    if (connects.length != 3 || this.clipsBar.style.visibility == "visible" || this.clipsBar.style.visibility == "") {
      // Remove last connect, then add connects
      // for new starts and add 'false' back to end.
      connects.pop();
      connects.push(false, true, false);

      // Add tooltips to new connects
      tooltips.push(true, false);
    } else {
      // Empty starts to remove last clip that is hidden
      starts = [];

      // Show clips bar
      this.clipsBar.style.visibility = "visible";
    }

    // Add new starts and then sort the array.
    // CANT have array as [100, 200, 50, 80]
    starts.push(currentProgress, currentProgress + 5);
    starts.sort((a, b) => a - b);

    this.createClipsBar(starts, connects, tooltips);

    // Show continue button clip info
    this.continueBtnCI = true;
  }

  /**
   * Remove clip
   * @param connectIndex Index from 'clipsBar.noUiSlider.get()' array that relates
   *                     to the first handle bars value on the clip being removed.
   */
  removeClip(connectIndex: number) {
    let allHandleValues = (this.clipsBar.noUiSlider.get() as string[]).map(Number);
    let handleValues = [allHandleValues[connectIndex], allHandleValues[connectIndex + 1]];

    let starts = (this.clipsBar.noUiSlider.get() as string[]).map(Number);
    let connects = this.clipsBar.noUiSlider.options.connect! as boolean[];
    let tooltips = this.clipsBar.noUiSlider.options.tooltips as boolean[];

    // Remove all clips normally unless there is
    // only one left, in that case, just hide the clips bar.
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
      this.continueBtnCI = false;

      // Hide clips bar
      this.clipsBar.style.visibility = "hidden";
    }

    this.createClipsBar(starts, connects, tooltips);
  }

  saveClips() {
    RecordingsManager.clip(this.videoPath, (this.clipsBar.noUiSlider.get() as string[]).map(Number));
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
    let tooltips: Array<HTMLElement | Boolean> = this.clipsBar.noUiSlider.getTooltips();
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
.videoPlayerContainer {
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

  .progressBarContainer {
    width: 100%;
    height: 40px;
    padding: 0 10px;
    background-color: $secondaryColor;
    // overflow-y: hidden;
    // overflow-x: auto;

    // &::-webkit-scrollbar {
    //   height: 5px;
    // }

    // &::-webkit-scrollbar-track {
    //   background-color: $secondaryColor;
    // }

    .progressBar {
      // width: 200%;
      height: 100%;
      background-color: $secondaryColor;

      .noUi-origin {
        transition: transform 80ms ease-in;

        &:active {
          transition: transform 0ms;
        }
      }

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
        }
      }
    }

    .clipsBar {
      position: relative;
      top: -100%;
      width: 100%;
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
      }
    }
  }
}
</style>
