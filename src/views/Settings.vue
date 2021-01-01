<template>
  <div id="settingsPage">
    <div class="nav">
      <ul>
        <li @click="swapComponent('GeneralSettings')">
          <span>General</span>
        </li>
        <li @click="swapComponent('RecordingSettings')">
          <span>Recording</span>
        </li>
        <li @click="swapComponent('KeyBindingSettings')">
          <span>Key Bindings</span>
        </li>
      </ul>
    </div>

    <keep-alive>
      <div class="settingsContent">
        <div v-bind:is="activeSubPage"></div>
      </div>
    </keep-alive>
  </div>
</template>

<script lang="ts">
import { Vue } from "vue-property-decorator";

export default Vue.extend({
  data() {
    return {
      activeSubPage: "GeneralSettings"
    };
  },
  components: {
    GeneralSettings: () => import("./../components/settings/General.vue"),
    RecordingSettings: () => import("./../components/settings/Recording.vue"),
    KeyBindingSettings: () => import("./../components/settings/KeyBinding.vue")
  },
  methods: {
    swapComponent: function(component: any) {
      this.activeSubPage = component;
      console.log(this.activeSubPage);
    }
  }
});
</script>

<style lang="scss">
#settingsPage {
  .nav {
    position: absolute;
    height: 100%;
    width: 200px;
    top: 68px;
    left: 0;
    background-color: $secondaryColor;

    ul {
      display: flex;
      flex-flow: column;
      position: absolute;
      list-style: none;
      width: 100%;
      height: calc(100% - 68px);
      overflow-y: auto;

      li {
        font-size: 24px;
        background-position: right;
        transition: all 150ms linear;
        width: 100%;
        padding: 10px 15px;
        cursor: pointer;

        .active,
        &.save:hover,
        &:hover {
          background-color: $primaryColor;
          background: linear-gradient(to right, $primaryColor 50%, #f000 50%);
          background-size: 200% 100%;
          background-position: left;
        }
      }
    }
  }

  .settingsContent {
    display: flex;
    align-items: center;
    flex-flow: column;
    position: absolute;
    right: 0;
    width: calc(100% - 200px);
    height: calc(100% - 66px);
    overflow-y: auto;

    .pageTitle {
      font-size: 30px;
    }

    .settings {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-flow: column;
      margin: 15px 15px;
      width: 50%;

      .setting {
        width: 100%;
        margin: 15px 0;

        .title {
          display: inline-flex;
          font-weight: bold;
          margin-bottom: 8px;
        }

        .checkBoxContainer {
          margin-left: 5px;
        }
      }

      @media (max-width: 1000px) {
        width: 80%;
      }
    }
  }
}
</style>
