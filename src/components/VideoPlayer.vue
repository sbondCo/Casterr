<template>
  <div class="videoPlayerContainer">
    <div v-if="videoExists">
      <video
        ref="videoPlayer"
        id="video"
        :src="'secfile://' + videoPath"
        @loadedmetadata="videoLoaded"
        width="450"
        controls
      ></video>

      <div>
        <input ref="progressBar" type="range" value="0" min="0" />
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
    const progress = this.$refs.progressBar as HTMLInputElement;

    // Set max for progress bar to videos duration
    progress.max = video.duration.toString();

    /**
     * Update progress bar with video progress.
     */
    video.addEventListener("timeupdate", () => {
      progress.value = video.currentTime.toString();
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
}
</style>
