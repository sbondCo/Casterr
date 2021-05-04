<template>
  <svg v-html="Icon" :width="wh" :height="wh" :viewBox="viewBox"></svg>
</template>

<script lang="ts">
import { Prop, Component, Vue } from "vue-property-decorator";

@Component
export default class Icon extends Vue {
  @Prop({ required: true }) i: string;
  @Prop({ default: 24 }) wh: number;

  viewBox = "0 0 24 24";

  /**
   * Return html string for Icon
   * requested with correct width and height
   */
  public get Icon(): string {
    switch (this.i) {
      case "play":
        this.viewBox = "0 0 12 14";
        return `
          <path fill-rule="evenodd" clip-rule="evenodd" d="M11.5 7L0.5 14V0L11.5 7ZM7.77002 7L2.5 3.64V10.36L7.77002 7Z" />
        `;
      case "pause":
        this.viewBox = "0 0 35 41";
        return `
          <path fill-rule="evenodd" clip-rule="evenodd" d="M0 41H11.6667V0H0V41ZM23.3333 0V41H35V0H23.3333Z"/>
        `;
      case "upload":
        this.viewBox = "0 0 16 18";
        return `
          <path fill-rule="evenodd" clip-rule="evenodd" d="M0 2V0H16V2H0ZM7 8H4L8 4L12 8H9V18H7V8Z" />
        `;
      case "volumeMute":
        this.viewBox = "0 0 50 50";
        return `
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M3.886 0L0 3.889l12.018 12.024-.8.827H.193v16.547h11.025L25 47.077V28.902L36.522
            40.43c-1.792 1.352-3.804 2.427-6.01 3.062v5.68c3.694-.827 7.084-2.537 9.951-4.826L46.113
            50 50 46.111 3.886 0zm15.601 33.756l-5.981-5.985h-7.8v-5.515h7.8l2.426-2.427 3.555
            3.557v10.37zm23.677-2.289a19.248 19.248 0 001.13-6.453c0-8.743-5.816-16.134-13.781-18.505V.827c11.053
            2.51 19.294 12.383 19.294 24.187 0 3.833-.882 7.446-2.425 10.673l-4.218-4.22zM25 2.951l-5.182 5.185L25
            13.32V2.95zM30.513 13.9c4.08 2.04 6.89 6.232 6.89 11.114 0 .22-.027.441-.055.662l-6.835-6.84V13.9z"
          />
        `;
      case "volumeMed":
        this.viewBox = "0 0 38 46";
        return `
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M0 14.448v17.104h11.111L25 45.805V.195L11.111
            14.448H0zm19.444-.484v18.073l-6.027-6.186H5.556V20.15h7.86l6.028-6.186zm11.111-2.452C34.667
            13.622 37.5 17.954 37.5 23c0 5.046-2.833 9.379-6.945 11.46V11.512z"
          />
        `;
      case "volumeMax":
        this.viewBox = "0 0 18 18";
        return `
          <path fill-rule="evenodd" clip-rule="evenodd" 
            d="M0 6v6h4l5 5V1L4 6H0zm7-.17v6.34L4.83 10H2V8h2.83L7 5.83zM13.5 9A4.5 4.5 0 0011 
            4.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM11 .23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 
            6.71v2.06c4.01-.91 7-4.49 7-8.77 0-4.28-2.99-7.86-7-8.77z"
          />
        `;
      case "settings":
        this.viewBox = "0 0 20 20";
        return `
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
        `;
      case "add":
        this.viewBox = "0 0 68 68";
        return `
          <path d="M68 38.857H38.857V68h-9.714V38.857H0v-9.714h29.143V0h9.714v29.143H68v9.714z" />
        `;
      case "min":
        this.viewBox = "0 0 12 12";
        return `
          <rect width="10" height="1" x="1" y="6"></rect>
        `;
      case "max":
        this.viewBox = "0 0 12 12";
        return `
          <rect width="9" height="9" x="1.5" y="1.5" fill="none" stroke="currentColor"></rect>
        `;
      case "close":
        this.viewBox = "0 0 12 12";
        return `
          <polygon fill-rule="evenodd" clip-rule="evenodd"
            points="11 1.576 6.583 6 11 10.424 10.424 11 6 6.583
            1.576 11 1 10.424 5.417 6 1 1.576 1.576 1 6 5.417 10.424 1">
          </polygon>
        `;
      // Arrow points right by default, plan is to just rotate it when needed instead of having arrows for each direction
      case "arrow":
        this.viewBox = "0 0 57 57";
        return `
          <path fill-rule="evenodd" clip-rule="evenodd" 
            d="M28.5.167L23.506 5.16 43.27 24.957H.167v7.084h43.102L23.506 51.84l4.994 4.993L56.833 28.5 28.5.167z"
          />
        `;
      // Chevron points right by default, plan is to just rotate it when needed instead of having chevrons for each direction
      case "chevron":
        this.viewBox = "0 0 8 12";
        return `
          <path fill-rule="evenodd" clip-rule="evenodd" d="M1.7 0L.3 1.41 4.88 6 .3 10.59 1.7 12l6-6-6-6z"/>
        `;
      case "clips":
        this.viewBox = "0 0 30 30";
        return `
          <path 
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M3 15C3 8.385 8.385 3 15 3s12 5.385 12 12-5.385 12-12 12S3
            21.615 3 15zm-3 0c0 8.28 6.72 15 15 15 8.28 0 15-6.72 15-15 
            0-8.28-6.72-15-15-15C6.72 0 0 6.72 0 15zm19.5 0l-6 6V9l6 6z"
          />
        `;
      case "time":
        this.viewBox = "0 0 30 30";
        return `
          <path 
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M14.985 0C6.705 0 0 6.72 0 15c0 8.28 6.705 15 14.985 15C23.28 30 30 
            23.28 30 15c0-8.28-6.72-15-15.015-15zM15 27C8.37 27 3 21.63 3 15S8.37 3 
            15 3s12 5.37 12 12-5.37 12-12 12zm.75-19.5H13.5v9l7.875 4.725L22.5 19.38l-6.75-4.005V7.5z" 
          />
        `;
      case "edit":
        this.viewBox = "0 0 512 512";
        return `
          <path d="M496.063 62.299l-46.396-46.4c-21.2-21.199-55.69-21.198-76.888
            0l-18.16 18.161 123.284 123.294 18.16-18.161c21.248-21.249
            21.251-55.643 0-76.894zM22.012 376.747L.251 494.268a15.002
            15.002 0 0017.48 17.482l117.512-21.763-113.231-113.24zM333.407
            55.274L38.198 350.506l123.284 123.293 295.209-295.231z">
          </path>
        `;
      default:
        return `
          oops
        `;
    }
  }
}
</script>

<style lang="scss" scoped>
svg {
  // Fix div around SVG being too tall
  display: flex;
}
</style>
