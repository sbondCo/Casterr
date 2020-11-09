<template>
  <div class="settings">
    <span class="pageTitle">General Settings</span>

    <div class="setting">
      <span class="title">Startup Page:</span>
      <!-- <DropDown Name="startupPage" Items="@startupPageItems" Placeholder="@gs.StartupPage" OnSelectedChanged=@UpdateSettings /> -->
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default class GeneralSettings extends Vue{}
</script>

<style lang="scss">

</style>
