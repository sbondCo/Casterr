<template>
  <div v-if="videoExists" class="videoPlayerContainer">
    <video ref="videoPlayer" id="video" :src="'secfile://' + videoPath" @loadedmetadata="videoLoaded" controls></video>

    <div class="progressBarContainer">
      <div ref="progressBar" class="progressBar">
        <div ref="scrubber" class="scrubberContainer">
          <div class="scrubber"></div>
        </div>
      </div>
    </div>
  </div>
  <span v-else>Video doesn't exist</span>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import Icon from "./Icon.vue";
import fs from "fs";
import path from "path";

@Component({
  components: {
    Icon
  }
})
export default class VideoPlayer extends Vue {
  @Prop({ required: true }) videoPath: string;

  private video: HTMLVideoElement;
  private progress: HTMLElement;
  private scrubber: HTMLElement;
  private isScrubbing: boolean = false;

  videoLoaded() {
    this.video = this.$refs.videoPlayer as HTMLVideoElement;
    this.progress = this.$refs.progressBar as HTMLElement;
    this.scrubber = this.$refs.scrubber as HTMLElement;

    this.video.addEventListener("timeupdate", () => {
      // const percentageWatched = (this.video.currentTime / this.video.duration) * 100;
      // const pixelsToTranslateX = (this.progress.clientWidth * (percentageWatched / 100)).toFixed(0);
      // this.scrubber.style.transform = `translateX(${pixelsToTranslateX}px)`;
    });
    this.progress.addEventListener("mousedown", this.scrub);
    this.progress.addEventListener("mousemove", this.scrub);
    document.addEventListener("mouseup", this.scrub);
  }

  scrub(e: MouseEvent) {
    const scrub = () => {
      const timeClickedTo = (e.offsetX / this.progress.clientWidth) * this.video.duration;
      this.scrubber.style.left = `${e.offsetX}px`;
      this.video.currentTime = timeClickedTo;

      // console.log(e.offsetX, this.progress.clientWidth);
    };

    switch (e.type) {
      case "mousedown":
        scrub();
        this.isScrubbing = true;
        break;
      case "mousemove":
        if (this.isScrubbing) scrub();
        break;
      case "mouseup":
        if (this.isScrubbing) this.isScrubbing = false;
        break;
    }
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

<style lang="scss" scoped>
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

  }

  .progressBar {
    height: 40px;
    // width: 90%;
    // background-color: $secondaryColor;

    .scrubberContainer {
      display: flex;
      align-items: center;
      position: relative;
      height: 100%;
      pointer-events: none;

      .scrubber {
        position: absolute;
        left: -7px;
        width: 12px;
        height: 30px;
        background-color: $darkAccentColor;
        border: 1px solid $textPrimary;
        border-radius: 4px;
      }
    }
  }
}
</style>
