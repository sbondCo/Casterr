<template>
  <div
    id="recordings"
    @drop="addDroppedRecordings"
    @dragover="handleDragOver"
    @dragenter="handleDragEnter"
    @dragleave="handleDragEnd"
  >
    <div class="wrapper">
      <div class="viewToggler">
        <router-link
          v-for="page in subPages"
          :key="page"
          :to="{ name: 'videos', params: { subPage: page } }"
          :class="{ active: page == subPage }"
        >
          {{ page }}
        </router-link>
      </div>

      <div class="thumbContainer" v-if="videos.length > 0">
        <div class="thumb" v-for="vid in loadedVideos" :key="vid.id">
          <div class="inner">
            <!-- If thumbPath is an actual file display it, otherwise, display noThumb message -->
            <img
              v-if="require('fs').existsSync(vid.thumbPath)"
              :src="'secfile://' + vid.thumbPath"
              alt="Video Thumbnail"
            />
            <span v-else class="noThumb">No Thumbnail Found</span>

            <div class="info">
              <span class="fps">
                {{ vid.fps }}
                <p>FPS</p>
              </span>

              <router-link
                :to="{ name: 'videoEditor', params: { video: vid, isClip: subPage == 'clips' } }"
                class="edit"
              >
                <Icon i="edit" :wh="25" />
              </router-link>

              <div class="bar">
                <span class="title">
                  <p>{{ vid.name ? vid.name : vid.videoPath }}</p>
                </span>

                <div class="videoInfo">
                  <span v-if="vid.duration >= 0">{{ vid.duration.toReadableTimeFromSeconds() }}</span>
                  <span v-if="vid.fileSize >= 0">{{ vid.fileSize.toReadableFileSize() }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <span v-else class="noRecordings txt-capitalised">You Have No {{ subPage }}!</span>
    </div>

    <div :class="{ dropZone: true, hidden: dropZoneHidden }">
      <Icon i="add" wh="36" />
      <span class="txt-capitalised">Add {{ subPage }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop } from "vue-property-decorator";
import Icon from "@/components/Icon.vue";
import RecordingsManager from "@/libs/recorder/recordingsManager";
import "@/libs/helpers/extensions";
import "@/libs/helpers/notifications";

const subPages = ["recordings", "clips"] as const;
type subPage = typeof subPages[number];

@Component({
  components: {
    Icon
  }
})
export default class extends Vue {
  @Prop({ default: "recordings" }) subPage: subPage;

  subPages = subPages;

  allRecordings = RecordingsManager.get();
  allClips = RecordingsManager.get(true);
  videos = this.$props.subPage == "recordings" ? this.allRecordings : this.allClips;
  loadedVideos = new Array();

  dropZoneHidden = true;
  dragEnterTarget: EventTarget | null = null;

  mounted() {
    // Load initial set of recordings
    this.loadMoreVideos();

    let el = document.getElementById("main");
    el?.addEventListener("scroll", () => {
      // If scrolled to bottom loadMoreVideos
      if (el?.scrollHeight! - el?.scrollTop! - 200 <= el?.clientHeight!) {
        this.loadMoreVideos();
      }
    });
  }

  @Watch("subPage")
  subPageChanged(val: subPage) {
    this.loadedVideos = [];

    if (val == "recordings") {
      this.videos = this.allRecordings;
    } else {
      this.videos = this.allClips;
    }

    this.loadMoreVideos();
  }

  /**
   * Load more recordings into view
   */
  loadMoreVideos() {
    // How many videos to load in
    let videosToLoad = 8;

    // Loop over videos after removing currently loaded recordings adding to loadedVideos
    for (let [i, v] of this.videos.slice(this.loadedVideos.length).entries()) {
      // Add to loadedVideos
      this.loadedVideos.push(v);

      // Stop for loop if index >= videosToLoad
      if (i >= videosToLoad) return;
    }
  }

  /**
   * Handles DragOver event.
   * Just prevents the default browser action
   * currently so that the custom drag handling works.
   */
  handleDragOver(event: DragEvent) {
    // Prevent default behavior so out drop event will work.
    event.preventDefault();
    event.stopPropagation();
  }

  /**
   * Handles DragEnter event.
   * Shows dropZone to user when they drag files to recordings view.
   */
  handleDragEnter(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();

    // Store target so we can reference it in the DragEnd event.
    this.dragEnterTarget = event.target;

    this.dropZoneHidden = false;
  }

  /**
   * Handles DragEnd event.
   * Hides dropZone when user ends drag.
   */
  handleDragEnd(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();

    // Only act as if drag has actually ended
    // if dragEnterTarget is the same as event.target.
    if (this.dragEnterTarget == event.target) {
      this.dropZoneHidden = true;
    }
  }

  /**
   * Handles Drop event.
   * Add files that user drops to their recordings.
   */
  addDroppedRecordings(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();

    this.dropZoneHidden = true;

    // Add dropped files to recordings
    if (event.dataTransfer != null) {
      for (var i = 0; i < event.dataTransfer.items.length; i++) {
        const item = event.dataTransfer.items[i];
        const video = item.getAsFile();

        // Only add to recordings if the file is a video
        if (item.kind === "file" && item.type.includes("video") && video) {
          RecordingsManager.add(video.path);
        }
      }
    }
  }
}
</script>

<style lang="scss">
#recordings {
  display: flex;
  flex-flow: column;
  align-items: center;
  min-height: calc(100% - 24px);
  margin: 12px 20px;

  .wrapper {
    width: 100%;
    max-width: 1600px;

    & > div:not(.dropZone):not(:last-child) {
      margin-bottom: 12px;
    }

    .noRecordings {
      display: flex;
      justify-content: center;
      margin-top: 35px;
      font-size: 32px;
    }

    .viewToggler {
      align-self: flex-start;
      font-size: 28px;

      a {
        text-transform: capitalize;
        cursor: pointer;

        &:not(.active) {
          color: $textPrimaryHover;
        }

        &:not(:first-child) {
          margin-left: 15px;
        }
      }
    }

    .thumbContainer {
      display: flex;
      flex-wrap: wrap;

      .thumb {
        flex-grow: 1;
        width: 25%;
        height: 250px;
        margin-bottom: 20px;
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
              background-color: change-color($color: $darkAccentColor, $alpha: 0.5);
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
          width: 100%;
        }

        @media (min-width: 800px) and (max-width: 1200px) {
          width: 45%;

          &:nth-child(even):not(:only-child) {
            margin-left: 20px;
          }
        }

        @media (min-width: 1200px) {
          width: 25%;

          &:not(:only-child) {
            margin-left: 20px;
          }

          &:first-child {
            margin-left: 0;
          }

          &:nth-child(3n + 4) {
            margin-left: 0;
          }
        }
      }
    }
  }

  .dropZone {
    display: flex;
    flex-flow: row;
    align-items: center;
    position: fixed;
    top: 50%;
    padding: 15px;
    border-radius: 4px;
    border: dashed 2px $textPrimaryHover;
    background-color: rgba($darkAccentColor, 0.8);
    font-size: 36px;
    font-weight: bold;

    svg {
      margin-right: 15px;
      fill: $textPrimary;
    }
  }
}
</style>
