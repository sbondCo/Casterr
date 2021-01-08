<template>
  <div class="videoPlayerContainer">
    {{ videoPath }}

    <video v-if="videoExists" id="video" :src="'secfile://' + videoPath" width="450" controls></video>
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
