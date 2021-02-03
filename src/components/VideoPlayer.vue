<template>
  <div v-if="videoExists" class="videoPlayerContainer">
    <video ref="videoPlayer" id="video" :src="'secfile://' + videoPath" @loadedmetadata="videoLoaded" controls></video>

    <div class="progressBarContainer">
      <div ref="progressBar" class="progressBar"></div>
    </div>
  </div>
  <span v-else>Video doesn't exist</span>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import Icon from "./Icon.vue";
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
  videoLoaded() {
    this.video = this.$refs.videoPlayer as HTMLVideoElement;
    this.progressBar = this.$refs.progressBar as noUiSlider.Instance;

    noUiSlider.create(this.progressBar, {
      start: [0],
      range: {
        min: 0,
        max: this.video.duration
      },
      pips: {
        mode: "count",
        values: 10
      }
    });

    this.progressBar.noUiSlider.on("update", (values: any) => {
      console.log(values[0]);
      this.video.currentTime = values[0];
    });
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
    padding: 0 10px;
    background-color: $secondaryColor;

    .progressBar {
      * {
        box-shadow: unset;
        outline: unset;
      }

      &.noUi-target {
        background-color: $secondaryColor;
        border-radius: unset;
        border: unset;
        box-shadow: unset;
        height: 40px;
      }

      .noUi-handle {
        display: flex;
        align-items: center;
        justify-content: center;
        top: 5px;
        right: -6px;
        width: 12px;
        height: 30px;
        background-color: $darkAccentColor;
        border: 1px solid $textPrimary;
        border-radius: 4px;

        &::before,
        &::after {
          display: none;
        }
      }

      .noUi-pips {
        top: 11px;
        height: unset;
        padding: unset;

        .noUi-marker {
          display: none;
        }

        .noUi-value {
        }
      }
    }
  }
}
</style>
