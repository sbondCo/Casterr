<template>
  <div>
    <div id="tooltip">
      <div class="arrow"></div>
    </div>

    <section id="notifications"></section>

    <section id="top">
      <Dragger />
      <Nav />
    </section>

    <section id="main">
      <slot />
    </section>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import Dragger from "./../components/Dragger.vue";
import Nav from "./../components/Nav.vue";
import router from "./../router";
import { AppSettings, GeneralSettings } from "./../libs/settings";
import "@/libs/helpers/extensions";

@Component({
  components: {
    Dragger,
    Nav
  }
})
export default class DefaultLayout extends Vue {
  mounted() {
    const excludedPages = ["videoPlayer"];

    // If user is on an excludedPage, don't push user to their default startupPage.
    if (!String(this.$route.name).equalsAnyOf(excludedPages)) {
      // Redirect to startup page defined in settings
      // If startupPage setting is a page in the application, redirect to it
      // Else go to first page in AppSettings.pages setting
      if (AppSettings.pages.includes(GeneralSettings.startupPage)) {
        router.push(GeneralSettings.startupPage).catch(() => {});
      } else {
        router.push(AppSettings.pages[0]).catch(() => {});
      }
    }

    this.applyTooltips();
  }

  applyTooltips() {
    const tooltip = document.getElementById("tooltip")!;
    let els = document.querySelectorAll("[tooltip]");

    for (let i = 0, n = els.length; i < n; ++i) {
      let el = els[i];

      el.addEventListener("mouseover", () => {
        const r = el.getBoundingClientRect();
        // console.log(r);

        tooltip.innerHTML = el.getAttribute("tooltip")!;

        tooltip.style.transform = "scale(1)";
        tooltip.style.top = `${r.top - r.height - 3}px`;
        console.log(tooltip.style.transform, `${r.left + r.width / 2 - tooltip.getBoundingClientRect().width / 2}px`);
        tooltip.style.left = `${r.left + r.width / 2 - tooltip.getBoundingClientRect().width / 2}px`;

        tooltip.style.opacity = "1";
      });

      el.addEventListener("mouseleave", () => {
        tooltip.style.transform = "scale(0.85)";
        tooltip.style.opacity = "0";
      });
    }
  }
}
</script>

<style lang="scss">
section#top {
  width: 100%;
  z-index: 9999999;
}

section#main {
  height: calc(100vh - 66px);
  overflow-y: auto;
  background-color: $primaryColor;
}

#tooltip {
  position: fixed;
  opacity: 0;
  padding: 8px 10px;
  background-color: $darkAccentColor;
  border-radius: 3px;
  box-shadow: 0px 0px 8px $darkAccentColor;
  font-size: 13px;
  transition: opacity 150ms ease-in-out, left 25ms ease-in-out, transform 50ms ease;
  z-index: 100;
  pointer-events: none;

  &:before {
    content: "";
    position: absolute;
    width: 0;
    height: 0;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 6px solid transparent;
    border-top-color: $darkAccentColor;
  }
}
</style>
