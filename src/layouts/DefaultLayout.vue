<template>
  <div>
    <section id="notifications">
    </section>

    <section id="top">
      <Dragger />
      <Nav />
    </section>

    <slot />
  </div>
</template>

<script>
import { Vue, Component } from "vue-property-decorator";
import Dragger from "./../components/Dragger.vue";
import Nav from "./../components/Nav.vue";
import router from "./../router";
import { AppSettings, GeneralSettings } from "./../libs/settings";

@Component({
  components: {
    Dragger,
    Nav
  }
})
export default class DefaultLayout extends Vue {
  mounted() {
    // Redirect to startup page defined in settings
    // If startupPage setting is a page in the application, redirect to it
    // Else go to first page in AppSettings.pages setting
    if (AppSettings.pages.includes(GeneralSettings.startupPage)) {
      router.push(GeneralSettings.startupPage).catch(()=>{});
    } else {
      router.push(AppSettings.pages[0]).catch(()=>{});
    }
  }
}
</script>
