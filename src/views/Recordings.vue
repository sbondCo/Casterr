<template>
  <div id="recordings">
    <span>Recordings Page</span>

    <!-- <video id="video" src="" width="450" controls></video> -->
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { RecordingSettings } from "./../libs/settings";

export default Vue.extend({
  mounted() {
    return console.log(RecordingSettings.thumbSaveFolder);
  }
})
</script>
