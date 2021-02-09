<template>
  <div v-if="videoExists" class="videoPlayerContainer">
    <div class="top"></div>

    <video ref="videoPlayer" id="video" :src="'secfile://' + videoPath" @loadedmetadata="videoLoaded" controls></video>

    <div class="progressBarContainer">
      <div ref="progressBar" class="progressBar"></div>
      <div ref="clipsBar" class="clipsBar"></div>
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

  videoLoaded() {
    this.video = this.$refs.videoPlayer as HTMLVideoElement;
    this.progressBar = this.$refs.progressBar as noUiSlider.Instance;
    this.clipsBar = this.$refs.clipsBar as noUiSlider.Instance;

    noUiSlider.create(this.progressBar, {
      start: [0],
      range: {
        min: 0,
        max: this.video.duration // + 99999
      },
      tooltips: true,
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

    this.progressBar.noUiSlider.on("update", (values: any) => {
      this.video.currentTime = values[0];

      let tooltip: HTMLElement = this.progressBar.noUiSlider.getTooltips()[0] as HTMLElement;
      let rect = tooltip.getBoundingClientRect();

      if (rect.x > rect.width / 2 && rect.right < window.innerWidth - rect.width / 2) {
        tooltip.style.left = "50%";
      }

      if (rect.x < 0) {
        tooltip.style.left = `${Math.abs(rect.x) + rect.width / 3}px`;
      }

      if (rect.x + rect.width > window.innerWidth) {
        tooltip.style.left = `${tooltip.clientLeft - rect.width / 3}px`;
      }
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

  .progressBarContainer {
    width: 100%;
    height: 40px;
    padding: 0 10px;
    background-color: $secondaryColor;

    * {
      box-shadow: unset;
      outline: unset;
      border: unset;
    }

    .progressBar {
      height: 100%;
      background-color: $secondaryColor;

      .noUi-handle {
        display: flex;
        align-items: center;
        justify-content: center;
        top: 0;
        right: -6px;
        width: 12px;
        height: 40px;
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
        display: flex;
        align-items: center;
        justify-content: center;
        top: 7px;
        right: -6px;
        width: 12px;
        height: 25px;
        background-color: $darkAccentColor;
        border: 1px solid $textPrimary;
        border-radius: 0px;
        pointer-events: all;

        &::before,
        &::after {
          display: none;
        }

        &:active {
          cursor: grabbing;
        }
      }

      .noUi-tooltip {
        display: none;
      }
    }
  }
}
</style>
