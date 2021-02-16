<template>
  <div v-if="videoExists" class="videoPlayerContainer">
    <video ref="videoPlayer" id="video" :src="'secfile://' + videoPath" @loadedmetadata="videoLoaded" controls></video>

    <div class="progressBarContainer">
      <div ref="progressBar" class="progressBar"></div>
      <div ref="clipsBar" class="clipsBar"></div>
    </div>

    <div class="controls">
      <button @click="playPause">
        <Icon :i="playPauseBtnIcon" />
      </button>

      <button class="volumeContainer">
        <Icon i="volume" />
        <div ref="volumeBar" class="volumeBar"></div>
      </button>

      <button class="outlined">{{ currentVideoTime }} / {{ maxVideoTime }}</button>
    </div>
  </div>
  <span v-else>Video doesn't exist</span>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import Icon from "./Icon.vue";
import "./../libs/helpers/extensions";
import fs from "fs";
import path from "path";
import noUiSlider from "nouislider";

@Component({
  components: {
    Icon
  }
})
export default class VideoPlayer extends Vue {
  @Prop({ required: true }) videoPath: string;

  private video: HTMLVideoElement;
  private progressBar: noUiSlider.Instance;
  private clipsBar: noUiSlider.Instance;
  private volumeBar: noUiSlider.Instance;

  currentVideoTime = "00:00";
  maxVideoTime = "00:00";
  playPauseBtnIcon = "play";

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

  videoLoaded() {
    this.video = this.$refs.videoPlayer as HTMLVideoElement;
    this.progressBar = this.$refs.progressBar as noUiSlider.Instance;
    this.clipsBar = this.$refs.clipsBar as noUiSlider.Instance;
    this.volumeBar = this.$refs.volumeBar as noUiSlider.Instance;

    this.maxVideoTime = this.video.duration.toReadableTimeFromSeconds();

    this.video.addEventListener("play", () => {
      this.playPause(false);
    });
    this.video.addEventListener("pause", () => {
      this.playPause(false);
    });

    noUiSlider.create(this.progressBar, {
      start: [0],
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

    const updateProgressBarTime = () => {
      this.progressBar.noUiSlider.set(this.video.currentTime);
      this.currentVideoTime = this.video.currentTime.toReadableTimeFromSeconds();
    };

    this.video.addEventListener("timeupdate", updateProgressBarTime);

    this.progressBar.noUiSlider.on("slide", (values: any[]) => {
      this.video.currentTime = values[0];
      this.currentVideoTime = this.video.currentTime.toReadableTimeFromSeconds();
    });

    this.progressBar.noUiSlider.on("start", () => {
      this.video.removeEventListener("timeupdate", updateProgressBarTime);
    });

    this.progressBar.noUiSlider.on("end", () => {
      this.video.addEventListener("timeupdate", updateProgressBarTime);
    });

    noUiSlider.create(this.clipsBar, {
      start: [1200, 1550, 2500, 3069, 4040, 4500],
      behaviour: "drag",
      connect: [false, true, false, true, false, true, false],
      tooltips: [true, false, true, false, true, false],
      range: {
        min: 0,
        max: this.video.duration
      }
    });

    this.clipsBar.noUiSlider.on("update", (values: any, handle: any) => {
      this.updateTooltip(values, handle);
    });

    this.progressBar.addEventListener("dblclick", () => {
      let pb = this.progressBar.noUiSlider;
      console.log(pb.options);
    });

    // Show/Hide tooltip on drag
    this.clipsBar.noUiSlider.on("start", (_, handle: any) => {
      this.getPairFromHandle(handle).tooltip.style.display = "block";
    });
    this.clipsBar.noUiSlider.on("end", (_, handle: any) => {
      this.getPairFromHandle(handle).tooltip.style.display = "none";
    });

    this.createVolumeBar();
  }

  createVolumeBar() {
    // Make volumeBar
    noUiSlider.create(this.volumeBar, {
      start: [80],
      range: {
        min: 0,
        max: 1
      }
    });

    // Update video volume on update
    this.volumeBar.noUiSlider.on("update", (values: any) => {
      this.video.volume = values[0];
    });
  }

  updateTooltip(values: any, handle: any) {
    let pair = this.getPairFromHandle(handle);

    // Set tooltip position
    pair.tooltip.style.left = `${(pair.connect.getBoundingClientRect().width + 8) / 2}px`;

    // Set tooltip value to clip length
    pair.tooltip.innerHTML = (
      parseFloat(values[pair.handle + 1]) - parseFloat(values[pair.handle])
    ).toReadableTimeFromSeconds();
  }

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
@import "./../../node_modules/nouislider/distribute/nouislider.css";

.videoPlayerContainer {
  width: 100%;

  video {
    width: 100%;
    height: 400px;
    outline: none;
    background-color: black;
  }

  // # Default slider styling
  * {
    box-shadow: unset;
    outline: unset;
    border: unset;
  }

  .noUi-handle {
    top: 0;
    right: -6px;
    width: 12px;
    height: 12px;
    background-color: $darkAccentColor;
    border: 1px solid $textPrimary;
    border-radius: 4px;

    &::before,
    &::after {
      display: none;
    }

    &:active {
      cursor: grabbing;
    }
  }
  // ^ Default slider styling

  .controls {
    display: flex;
    align-items: center;
    margin-top: 5px;
    height: 34px;

    button {
      display: flex;
      flex-flow: row;
      align-items: center;
      height: 100%;
      padding: 5px;
      margin-left: 5px;
      border: unset;
      border-radius: 3px;
      outline: unset;
      color: $textPrimary;
      background-color: $secondaryColor;

      &.volumeContainer {
        flex-flow: row;

        .volumeBar {
          width: 0;
          margin: 0;

          height: 5px;
          transition: width 150ms ease-in-out, margin 150ms ease-in-out;

          .noUi-handle {
            visibility: hidden;
            top: -3px;
            right: -6px;
            height: 12px;
            width: 12px;
          }
        }

        // Show volumeBar on hover.
        // Don't hide on hover so if user is a maniac when
        // changing the volume we won't ruin their experience
        &:hover,
        &:active {
          .volumeBar {
            width: 100px;
            margin: 0 7px 0 12px;

            .noUi-handle {
              visibility: visible;
            }
          }
        }
      }

      &.outlined {
        border: 2px solid $secondaryColor;
        background-color: transparent;
      }

      svg {
        fill: $textPrimary;
      }
    }
  }

  .progressBarContainer {
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
        }
      }
    }

    .clipsBar {
      position: relative;
      top: -100%;
      width: 100%;
      height: 100%;
      background-color: transparent;

      .noUi-base {
        pointer-events: none;
      }

      .noUi-draggable {
        background-color: rgba(255, 255, 255, 0.1);
        border: 1px solid $textPrimary;
        border-radius: 4px;
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
