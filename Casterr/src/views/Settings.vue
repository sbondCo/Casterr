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

    <div id="l" :is="activeSubPage"></div>
  </div>
</template>

<script lang="ts">
import { Vue } from "vue-property-decorator";

export default Vue.extend({
  data() {
    return {
      activeSubPage: "GeneralSettings"
    }
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
})
</script>

<style lang="scss">
#l {
  padding-left: 300px;
}

#settingsPage {
  .nav {
    position: absolute;
    height: 100%;
    width: 200px;
    top: 66px;
    left: 0;
    background-color: $secondaryColor;

    ul {
      display: flex;
      flex-flow: column;
      position: absolute;
      list-style: none;
      width: 100%;
      height: calc(100% - 66px);
      overflow-y: auto;

      li {
        display: flex;
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
}
</style>