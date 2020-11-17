<template>
  <div id="recordings">
    <span>Recordings Page</span>
    <button @click="startRecording">Start recording</button>

    <!-- <video id="video" src="" width="450" controls></video> -->
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Recorder from "./../libs/recorder";

export default Vue.extend({
  methods: {
    startRecording: function () {
      Recorder.start();
    }
  }
})
</script>
