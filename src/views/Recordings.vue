<template>
  <div id="recordings">
    <span>Recordings Page</span>
    <button @click="startRecording">Start recording</button>
    <button @click="stopRecording">Stop recording</button>

    <!-- <video id="video" src="" width="450" controls></video> -->
  </div>
</template>

<script lang="ts">
import ArgumentBuilder from "@/libs/recorder/argumentBuilder";
import Vue from "vue";
import Recorder from "./../libs/recorder";

export default Vue.extend({
  mounted() {
    console.log(ArgumentBuilder.getArgs())
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
