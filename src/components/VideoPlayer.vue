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

      <!-- <div>
        <input ref="progressBar" type="range" value="0" min="0" />
      </div> -->

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

  videoLoaded() {
    const video = this.$refs.videoPlayer as HTMLVideoElement;
    const progress = this.$refs.progressBar as HTMLElement;
    const scrubber = this.$refs.scrubber as HTMLElement;
    
    /**
     * Update progress bar with video progress.
     */
    video.addEventListener("timeupdate", () => {
      const percentageWatched = (video.currentTime / video.duration) * 100;
      // scrubber.style.left = `${percentageWatched.toString()}%`;

      console.log('percentageWatched: ' + percentageWatched)
    });

    progress.addEventListener('click', (e) => {
      const timeClickedTo = (e.clientX / progress.clientWidth) * 25;
      scrubber.style.left = `${e.offsetX}px`;
      video.currentTime = timeClickedTo;

      console.log('timeClickedTo: ' + timeClickedTo);
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
