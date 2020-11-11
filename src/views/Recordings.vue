<template>
  <div id="recordings">
    <span>Recordings Page</span>

    <!-- <video id="video" src="" width="450" controls></video> -->
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Settings } from "./../ts/settings/settingsManager";

export default Vue.extend({
  mounted() {
    return console.log(Settings.GeneralSettings.startupPage);
  }
})
</script>
