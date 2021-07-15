<template>
  <nav>
    <ul>
      <li>
        <router-link to="/videos">
          <Icon i="play" />
          <span>Videos</span>
        </router-link>
      </li>

      <li>
        <router-link to="/settings">
          <Icon i="settings" />
          <span>Settings</span>
        </router-link>
      </li>

      <li id="status">
        <span ref="timeElapsed" class="timeElapsed">{{ timeElapsed }}</span>

        <div
          ref="recordingStatus"
          class="circle idle"
          :title="`Start/Stop Recording\n\nWhite => Idle\nRed => Recording`"
          @click="startStopRecording"
        ></div>
      </li>
    </ul>
  </nav>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Icon from "./Icon.vue";
import Recorder from "@/libs/recorder";
import { GeneralSettings } from "@/libs/settings";

@Component({
  components: {
    Icon
  }
})
export default class Nav extends Vue {
  timeElapsed = "";

  mounted() {
    let timer: any;

    // Change recordingStatus circle depending on whether isRecording
    Recorder.recordingStatus.on("changed", (isRecording) => {
      let rs = this.$refs.recordingStatus as HTMLElement;
      const timeoutScheduled = Date.now();

      if (isRecording) {
        rs.classList.add("isRecording");

        // Set timeElapsed to `00:00` so you
        // get instant feedback once you start recording
        this.timeElapsed = "00:00";

        // Update elapsed time every second
        timer = setInterval(() => {
          // Get time elapsed in seconds
          const elapsed = (Date.now() - timeoutScheduled) / 1000;

          // Update time elapsed in a readable format
          this.timeElapsed = `${elapsed.toReadableTimeFromSeconds()}`;
        }, 1000);
      } else {
        rs.classList.remove("isRecording");

        // Clear timer if running and set timeElapsed to empty string
        clearTimeout(timer);
        this.timeElapsed = ``;
      }
    });
  }

  startStopRecording(e: MouseEvent) {
    // Don't record if click wasn't a double click.
    // If e.detail == 2 then the click was a double click, so
    // don't start/stop recording if it doesn't equal it.
    if (GeneralSettings.recordingStatusDblClkToRecord == true && e.detail != 2) {
      return;
    }

    // Only start/stop recording if setting is set to true
    if (GeneralSettings.recordingStatusAlsoStopStartRecording) {
      Recorder.auto();
    }
  }
}
</script>

<style lang="scss">
nav {
  display: flex;
  min-height: 50px;
  background-color: $secondaryColor;

  ul {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    list-style: none;

    li {
      color: $textPrimary;
      font-size: 24px;

      a,
      &#status {
        padding: 10px 15px;
        margin: 0 5px;
      }

      a {
        display: flex;
        align-items: center;
        justify-content: center;
        transition: color 250ms ease;

        svg {
          fill: $textPrimary;
          margin: 0 8px 0 0 !important;
          transition: fill 250ms ease;

          @media (max-width: 910px) {
            transition: width 250ms ease;
            margin: 0;
            width: 80px;
          }
        }
      }

      @media (max-width: 600px) {
        width: 20px;
      }

      span:not(.timeElapsed) {
        @media (max-width: 910px) {
          display: none;
        }
      }

      &:hover {
        a,
        svg {
          color: $textPrimaryHover;
          fill: $textPrimaryHover;
        }
      }

      &#status {
        display: flex;
        align-items: center;
        position: absolute;
        right: 10px;
        cursor: default;

        span {
          opacity: 1;
          margin: 0 15px;
          font-size: 18px;
          transition: opacity 250ms ease-in-out;

          &.hidden {
            display: unset !important;
            opacity: 0 !important;
          }
        }

        .circle {
          width: 20px;
          height: 20px;
          padding: 0 !important;
          border-radius: 50%;
          transition: background-color 250ms ease-in-out, box-shadow 250ms ease-in-out;
          cursor: pointer;
          background-color: $textPrimary;
          box-shadow: 0 0 8px $textPrimary;

          &.isRecording {
            background-color: $dangerColor !important;
            box-shadow: 0 0 8px $dangerColor !important;
          }
        }
      }
    }
  }
}
</style>
