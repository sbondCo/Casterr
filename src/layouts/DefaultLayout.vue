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

@Component({
  components: {
    Dragger,
    Nav
  }
})
export default class DefaultLayout extends Vue {}
</script>
