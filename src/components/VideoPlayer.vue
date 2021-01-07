<template>
  <div class="videoPlayerContainer">
    {{videoPath}}

    <video id="video" :src="'secfile://' + videoPath" width="450" controls></video>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import Icon from "./Icon.vue";

@Component({
  components: {
    Icon
  }
})
export default class VideoPlayer extends Vue {
  @Prop({ required: true }) videoPath: string;
}
</script>

<style lang="scss" scoped>
.videoPlayerContainer {
}
</style>
