<template>
  <div class="notificationContainer">
    <!-- If icon is undefined, default to 'play' icon -->
    <Icon :i="icon != 'undefined' ? icon : 'play'" wh="35" />

    <span class="title">{{ desc }}</span>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import Icon from "./../components/Icon.vue";

@Component({
  components: {
    Icon
  }
})
export default class extends Vue {
  @Prop({ default: "play" }) icon: string;
  @Prop({ required: true }) desc: string;
}
</script>

<style lang="scss">
.notificationContainer {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  background-color: $primaryColor;
  border-radius: 8px;
  border: $secondaryColor 5px solid;

  * {
    margin: 5px;
  }

  svg {
    fill: $textPrimary;
  }

  .title {
    font-size: 25px;
  }
}
</style>
