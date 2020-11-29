<template>
  <div id="recordings">
    <span>Recordings Page</span>
    <button @click="startRecording">Start recording</button>
    <button @click="stopRecording">Stop recording</button>

    <!-- <video id="video" src="" width="450" controls></video> -->
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Recorder from "./../libs/recorder";
import RecordingsManager from "./../libs/recorder/recordingsManager";

export default Vue.extend({
  mounted() {
    RecordingsManager.add("/home/sbondo/Videos/Casterr/night_of_the_living_dead.mp4");
  },
  methods: {
    startRecording: function () {
      Recorder.start();
    },
    stopRecording: function() {
      Recorder.stop()
    }
  }
})
</script>
