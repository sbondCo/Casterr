<template>
  <div v-if="videoExists" class="videoPlayerContainer">
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
        max: this.video.duration
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

    this.progressBar.noUiSlider.on("update", (values: any) => {
      this.video.currentTime = values[0];
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
  }

  updateTooltip(values: any, handle: any) {
    let tooltips = this.clipsBar.noUiSlider.getTooltips();
    let tooltip = tooltips[handle];

    if (tooltips[handle] == false) {
      handle = handle - 1;
      tooltip = tooltips[handle];
    }

    let connects = document.querySelectorAll<HTMLElement>(".clipsBar .noUi-connect");
    let connect = connects.item(tooltips.filter((e: any) => e != false).indexOf(tooltip));

    // Set tooltip position
    tooltip.style.left = `${(connect.getBoundingClientRect().width + 8) / 2}px`;

    // Set tooltip value to clip length
    tooltip.innerHTML = (parseFloat(values[handle + 1]) - parseFloat(values[handle])).toReadableTimeFromSeconds();
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
    }
  }
}
</style>
