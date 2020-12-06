<template>
  <div id="recordings">
    <!-- <button @click="startRecording">Start recording</button> -->
    <!-- <button @click="stopRecording">Stop recording</button> -->

    <div class="thumbContainer" v-if="allRecordings.length > 0">
      <div class="thumb" v-for="vid in loadedRecordings" :key="vid.id">
        <div class="inner">
          <!-- If thumbPath is an actual file display it, otherwise, display noThumb message -->
          <img v-if="require('fs').existsSync(vid.thumbPath)" :src="'secfile://' + vid.thumbPath" alt="Video Thumbnail" />
          <span v-else class="noThumb">No Thumbnail Found</span>

          <div class="info">
            <span class="fps">
              {{ vid.fps }}
              <p>FPS</p>
            </span>

            <span class="edit">
              <Icon i="edit" :wh="25" />
            </span>

            <div class="bar">
              <span class="title">
                <p>{{ vid.videoPath }}</p>
              </span>

              <div class="videoInfo">
                <span v-if="vid.duration">{{ vid.duration.toReadableTimeFromSeconds() }}</span>
                <span v-if="vid.fileSize">{{ vid.fileSize.toReadableFileSize() }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <span class="noRecordings">You Have No Recordings!</span>
    </div>

    <!-- <video id="video" src="" width="450" controls></video> -->
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import Icon from "./../components/Icon.vue";
import Recorder from "./../libs/recorder";
import RecordingsManager from "./../libs/recorder/recordingsManager";
import "./../libs/helpers/extensions";

@Component({
  components: {
    Icon,
  },
})
export default class extends Vue {
  data() {
    return {
      allRecordings: RecordingsManager.get(),
      loadedRecordings: new Array
    };
  }

  mounted() {
    // Load initial set of recordings
    this.loadMoreRecordings();

    let el = document.getElementById("main");
    el?.addEventListener("scroll", () => {
      // If scrolled to bottom loadMoreRecordings
      if (el?.scrollHeight! - el?.scrollTop! === el?.clientHeight) {
        this.loadMoreRecordings();
      }
    });
  }

  /**
   * Load more recordings into view
   */
  loadMoreRecordings() {
    // How many videos to load in
    let videosToLoad = 8;

    // Loop over allRecordings after removing currently loaded recordings adding to loadedRecordings
    for (let [i, v] of this.$data.allRecordings.slice(this.$data.loadedRecordings.length).entries()) {
      // Add to loadedRecordings
      this.$data.loadedRecordings.push(v);

      // Stop for loop if index >= videosToLoad
      if (i >= videosToLoad) return;
    }
  }

  startRecording() {
    Recorder.start();
  }

  stopRecording() {
    Recorder.stop();
  }
}
</script>

<style lang="scss">
#recordings {
  display: flex;
  justify-content: center;
  align-items: center;

  .noRecordings {
    display: flex;
    justify-content: center;
    align-items: center;
    height: calc(100vh - 86px);
    font-size: 32px;
  }

  .thumbContainer {
    display: flex;
    flex-wrap: wrap;
    margin: 10px;
    max-width: 1600px;

    .thumb {
      flex-grow: 1;
      width: 25%;
      height: 250px;
      margin: 10px;
      background-color: $quaternaryColor;
      border-radius: 4px;
      overflow: hidden;

      .inner {
        position: relative;
        height: 100%;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .noThumb {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 100%;
          font-size: 25px;
        }

        .info {
          position: absolute;
          top: 0;
          height: 100%;
          width: 100%;
          cursor: pointer;

          .fps {
            display: inline-flex;
            position: absolute;
            right: 0;
            padding: 10px;
            text-shadow: 1px 1px black;
            font-weight: bold;
            font-style: italic;

            * {
              padding: 0 5px;
            }
          }

          .edit {
            display: flex;
            justify-content: center;
            align-items: center;
            position: absolute;
            opacity: 0;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            transition: opacity 250ms ease-in-out;

            svg {
              fill: $textPrimary;
              filter: drop-shadow(0 0 5px $primaryColor);
            }
          }

          .bar {
            position: absolute;
            bottom: 0;
            right: 0;
            width: 100%;
            height: 40px;
            padding: 0 10px;
            line-height: 40px;
            background-color: change-color(
              $color: $darkAccentColor,
              $alpha: 0.5
            );
            transition: background-color 250ms ease-in-out;

            .title {
              display: flex;
              width: 60%;
              font-weight: 700;
              transition: width 250ms ease-in-out;

              p {
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
              }

              @media (max-width: 1370px) {
                width: 50%;
              }

              @media (max-width: 1130px) {
                width: 40%;
              }

              @media (max-width: 1000px) {
                width: 50%;
              }
            }

            .videoInfo {
              position: absolute;
              bottom: 0;
              right: 10px;

              span {
                padding: 5px;
                font-size: 15px;
              }
            }
          }

          &:hover {
            > .title {
              background-color: $darkAccentColor;
            }

            > .edit {
              opacity: 1;
            }
          }
        }
      }

      @media (max-width: 800px) {
        width: 50%;
      }

      @media (min-width: 800px) and (max-width: 1000px) {
        width: 33%;
      }

      @media (min-width: 1200px) {
        width: 25%;
      }
    }
  }
}
</style>
