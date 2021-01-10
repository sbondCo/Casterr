<template>
  <div class="videoPlayerContainer">
    <div v-if="videoExists">
      <video
        ref="videoPlayer"
        id="video"
        :src="'secfile://' + videoPath"
        @loadedmetadata="videoLoaded"
        controls
      ></video>

      <div ref="progressBar" class="progressBar">
        <div ref="scrubber" class="scrubber"></div>
      </div>
    </div>
    <span v-else>Video doesn't exist</span>
  </div>
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

    this.progress.addEventListener("mousedown", this.scrub);
    this.progress.addEventListener("mousemove", this.scrub);
    this.progress.addEventListener("mouseup", this.scrub);
  }

  scrub(e: MouseEvent) {
    const scrub = () => {
      const timeClickedTo = (e.clientX / this.progress.clientWidth) * 25;
      this.scrubber.style.left = `${e.offsetX}px`;
      this.video.currentTime = timeClickedTo;
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
  video {
    width: 100%;
    outline: none;
  }

  .progressBar {
    height: 30px;
    width: 90%;
    background-color: $secondaryColor;

    .scrubber {
      pointer-events: none;
      position: relative;
      width: 1px;
      height: 100%;
      padding: 5px;
      background-color: $darkAccentColor;
      border-radius: 4px;
    }
  }
}
</style>
