<template>
  <div v-html="Icon"></div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

const IconProps = Vue.extend({
  props: {
    i: String,
    wh: Number
  }
});

@Component

export default class Icon extends IconProps {
  /**
   * Return html string for Icon
   * requested with correct width and height
   */
  get Icon(): string {
    switch (this.i) {
      case "play":
        return `
          <svg width="${this.wh}" height="${this.wh}" viewBox="0 0 12 14" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M11.5 7L0.5 14V0L11.5 7ZM7.77002 7L2.5 3.64V10.36L7.77002 7Z" />
          </svg>
        `;
      case "upload":
        return `
          <svg width="${this.wh}" height="${this.wh}" viewBox="0 0 16 18" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M0 2V0H16V2H0ZM7 8H4L8 4L12 8H9V18H7V8Z" />
          </svg>
        `;
      case "settings":
        return `
          <svg width="${this.wh}" height="${this.wh}" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd"
              d="M17.502 10c0 .34-.03.66-.07.98l2.11 1.65c.19.15.24.42.12.64l-2
              3.46c-.09.16-.26.25-.43.25-.06 0-.12-.01-.18-.03l-2.49-1c-.52.39-1.08.73-1.69.98l-.38
              2.65c-.03.24-.24.42-.49.42h-4c-.25 0-.46-.18-.49-.42l-.38-2.65c-.61-.25-1.17-.58-1.69-.98l-2.49
              1a.5.5 0 01-.61-.22l-2-3.46a.505.505 0 01.12-.64l2.11-1.65c-.04-.32-.07-.65-.07-.98 0-.33.03-.66.07-.98L.462
              7.37a.493.493 0 01-.12-.64l2-3.46c.09-.16.26-.25.43-.25.06 0 .12.01.18.03l2.49 1c.52-.39
              1.08-.73 1.69-.98l.38-2.65c.03-.24.24-.42.49-.42h4c.25 0 .46.18.49.42l.38 2.65c.61.25 1.17.58
              1.69.98l2.49-1a.5.5 0 01.61.22l2 3.46c.12.22.07.49-.12.64l-2.11 1.65c.04.32.07.64.07.98zm-2 0c0-.21-.01-.42-.05-.73l-.14-1.13.89-.7
              1.07-.85-.7-1.21-1.27.51-1.06.43-.91-.7c-.4-.3-.8-.53-1.23-.71l-1.06-.43-.16-1.13-.19-1.35h-1.39l-.2
              1.35-.16 1.13-1.06.43c-.41.17-.82.41-1.25.73l-.9.68-1.04-.42-1.27-.51-.7 1.21 1.08.84.89.7-.14
              1.13c-.03.3-.05.53-.05.73 0 .2.02.43.05.74l.14 1.13-.89.7-1.08.84.7 1.21 1.27-.51 1.06-.43.91.7c.4.3.8.53
              1.23.71l1.06.43.16 1.13.19 1.35h1.4l.2-1.35.16-1.13 1.06-.43c.41-.17.82-.41 1.25-.73l.9-.68 1.04.42
              1.27.51.7-1.21-1.08-.84-.89-.7.14-1.13c.03-.3.05-.52.05-.73zm-5.5-4c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79
              4-4-1.79-4-4-4zm-2 4c0 1.1.9 2 2 2s2-.9 2-2-.9-2-2-2-2 .9-2 2z" />
          </svg>
        `;
      case "min":
        return `
          <svg width="${this.wh}" height="${this.wh}" viewBox="0 0 12 12">
            <rect width="10" height="1" x="1" y="6"></rect>
          </svg>
        `;
      case "max":
        return `
          <svg width="${this.wh}" height="${this.wh}" viewBox="0 0 12 12">
            <rect width="9" height="9" x="1.5" y="1.5" fill="none" stroke="currentColor"></rect>
          </svg>
        `;
      case "close":
        return `
          <svg width="${this.wh}" height="${this.wh}" viewBox="0 0 12 12">
            <polygon fill-rule="evenodd" 
              points="11 1.576 6.583 6 11 10.424 10.424 11 6 6.583
              1.576 11 1 10.424 5.417 6 1 1.576 1.576 1 6 5.417 10.424 1"></polygon>
          </svg>
        `;
      case "edit":
        return `
          <svg width="${this.wh}" height="${this.wh}" viewBox="0 0 512 512">
            <path d="M496.063 62.299l-46.396-46.4c-21.2-21.199-55.69-21.198-76.888
              0l-18.16 18.161 123.284 123.294 18.16-18.161c21.248-21.249
              21.251-55.643 0-76.894zM22.012 376.747L.251 494.268a15.002
              15.002 0 0017.48 17.482l117.512-21.763-113.231-113.24zM333.407
              55.274L38.198 350.506l123.284 123.293 295.209-295.231z">
            </path>
          </svg>
        `;
      default:
        return `
          oops
        `;
    }
  }
}
</script>
