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

@Component({
  components: {
    Icon
  }
})
export default class VideoPlayer extends Vue {
  @Prop({ required: true }) videoPath: string;

  get videoExists() {
    return fs.existsSync(this.videoPath)
  }
}
</script>

<style lang="scss" scoped>
.videoPlayerContainer {
}
</style>
