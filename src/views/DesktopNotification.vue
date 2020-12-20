<template>
  <div class="notificationContainer">
    <div class="content">
        <Icon :i="icon" wh="45" />
        <span class="title">@NotifyText</span>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import Icon from "./../components/Icon.vue";

@Component({
  components: {
    Icon,
  },
})
export default class extends Vue {
  @Prop() icon: string;
}
</script>

<style lang="scss">
.notificationContainer {
  position: absolute;
  background-color: $primaryColor;
  /*animation: slideIn 500ms ease-in forwards;*/

  .content {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    width: 100vw;

    svg {
      width: 25%;
      fill: $textPrimary;
    }

    .title {
      width: 75%;
      font-size: 25px;
    }
  }

  /*@keyframes slideIn {
        0% {
            left: 100%;
            
        }
        100% {
            left: 0px;
        }
    }*/
}
</style>