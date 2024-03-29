interface IconProps {
  // Icon name
  i: Icons;

  // Width and height
  wh?: number;

  // Icon direction
  direction?: IconDirection;

  className?: string;
  onClick?: React.MouseEventHandler;
}

export type Icons =
  | "play"
  | "pause"
  | "upload"
  | "volumeMute"
  | "volumeMed"
  | "volumeMax"
  | "settings"
  | "add"
  | "min2"
  | "min"
  | "max"
  | "close"
  | "arrow"
  | "chevron"
  | "clips"
  | "time"
  | "edit"
  | "search"
  | "pin"
  | "info"
  | "wifi"
  | "globe"
  | "youtube"
  | "folder"
  | "bookmark"
  | "film"
  | "camera"
  | "trash"
  | "move";

export type IconDirection = "up" | "down" | "left" | "right";

export default function Icon({ i, wh = 24, direction, className, onClick }: IconProps) {
  const icon = getIcon(i);

  const dirClass = () => {
    if (direction === "up") return "-rotate-90";
    else if (direction === "down") return "rotate-90";
    else if (direction === "left") return "rotate-180";
  };

  return (
    <svg
      width={wh}
      height={wh}
      viewBox={icon.viewBox}
      className={`${className ?? ""} ${dirClass() ?? ""} transition-all`}
      onClick={onClick}
    >
      {icon.el}
    </svg>
  );
}

function getIcon(name: Icons): { viewBox: string; el: JSX.Element } {
  switch (name) {
    case "play":
      return {
        viewBox: "0 0 12 14",
        el: (
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            fill="currentcolor"
            d="M11.5 7L0.5 14V0L11.5 7ZM7.77002 7L2.5 3.64V10.36L7.77002 7Z"
          />
        )
      };
    case "pause":
      return {
        viewBox: "0 0 35 41",
        el: (
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            fill="currentcolor"
            d="M0 41H11.6667V0H0V41ZM23.3333 0V41H35V0H23.3333Z"
          />
        )
      };
    case "upload":
      return {
        viewBox: "0 0 512 512",
        el: (
          <path
            fill="currentColor"
            d="M473.66 210c-14-10.38-31.2-18-49.36-22.11a16.11 16.11 0 01-12.19-12.22c-7.8-34.75-24.59-64.55-49.27-87.13C334.15 62.25 296.21 47.79 256 47.79c-35.35 0-68 11.08-94.37 32.05a150.07 150.07 0 00-42.06 53 16 16 0 01-11.31 8.87c-26.75 5.4-50.9 16.87-69.34 33.12C13.46 197.33 0 227.24 0 261.39c0 34.52 14.49 66 40.79 88.76 25.12 21.69 58.94 33.64 95.21 33.64h104V230.42l-36.69 36.69a16 16 0 01-23.16-.56c-5.8-6.37-5.24-16.3.85-22.39l63.69-63.68a16 16 0 0122.62 0L331 244.14c6.28 6.29 6.64 16.6.39 22.91a16 16 0 01-22.68.06L272 230.42v153.37h124c31.34 0 59.91-8.8 80.45-24.77 23.26-18.1 35.55-44 35.55-74.83 0-29.94-13.26-55.61-38.34-74.19zM240 448.21a16 16 0 1032 0v-64.42h-32z"
          />
        )
      };
    case "volumeMute":
      return {
        viewBox: "0 0 50 50",
        el: (
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            fill="currentcolor"
            d="M3.886 0L0 3.889l12.018 12.024-.8.827H.193v16.547h11.025L25 47.077V28.902L36.522
            40.43c-1.792 1.352-3.804 2.427-6.01 3.062v5.68c3.694-.827 7.084-2.537 9.951-4.826L46.113
            50 50 46.111 3.886 0zm15.601 33.756l-5.981-5.985h-7.8v-5.515h7.8l2.426-2.427 3.555
            3.557v10.37zm23.677-2.289a19.248 19.248 0 001.13-6.453c0-8.743-5.816-16.134-13.781-18.505V.827c11.053
            2.51 19.294 12.383 19.294 24.187 0 3.833-.882 7.446-2.425 10.673l-4.218-4.22zM25 2.951l-5.182 5.185L25
            13.32V2.95zM30.513 13.9c4.08 2.04 6.89 6.232 6.89 11.114 0 .22-.027.441-.055.662l-6.835-6.84V13.9z"
          />
        )
      };
    case "volumeMed":
      return {
        viewBox: "0 0 38 46",
        el: (
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            fill="currentcolor"
            d="M0 14.448v17.104h11.111L25 45.805V.195L11.111
            14.448H0zm19.444-.484v18.073l-6.027-6.186H5.556V20.15h7.86l6.028-6.186zm11.111-2.452C34.667
            13.622 37.5 17.954 37.5 23c0 5.046-2.833 9.379-6.945 11.46V11.512z"
          />
        )
      };
    case "volumeMax":
      return {
        viewBox: "0 0 18 18",
        el: (
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            fill="currentcolor"
            d="M0 6v6h4l5 5V1L4 6H0zm7-.17v6.34L4.83 10H2V8h2.83L7 5.83zM13.5 9A4.5 4.5 0 0011
            4.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM11 .23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5
            6.71v2.06c4.01-.91 7-4.49 7-8.77 0-4.28-2.99-7.86-7-8.77z"
          />
        )
      };
    case "settings":
      return {
        viewBox: "0 0 20 20",
        el: (
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            fill="currentcolor"
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
            4-4-1.79-4-4-4zm-2 4c0 1.1.9 2 2 2s2-.9 2-2-.9-2-2-2-2 .9-2 2z"
          />
        )
      };
    case "add":
      return {
        viewBox: "0 0 68 68",
        el: <path fill="currentcolor" d="M68 38.857H38.857V68h-9.714V38.857H0v-9.714h29.143V0h9.714v29.143H68v9.714z" />
      };
    case "min2":
      return {
        viewBox: "0 0 12 12",
        el: <rect width="10" height="2" x="1" y="5" fill="currentcolor"></rect>
      };
    case "min":
      return {
        viewBox: "0 0 12 12",
        el: <rect width="10" height="1" x="1" y="6" fill="currentcolor"></rect>
      };
    case "max":
      return {
        viewBox: "0 0 12 12",
        el: <rect width="9" height="9" x="1.5" y="1.5" fill="transparent" stroke="currentColor"></rect>
      };
    case "close":
      return {
        viewBox: "0 0 12 12",
        el: (
          <polygon
            fillRule="evenodd"
            clipRule="evenodd"
            fill="currentcolor"
            points="11 1.576 6.583 6 11 10.424 10.424 11 6 6.583
            1.576 11 1 10.424 5.417 6 1 1.576 1.576 1 6 5.417 10.424 1"
          ></polygon>
        )
      };
    case "arrow":
      return {
        viewBox: "0 0 57 57",
        el: (
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            fill="currentcolor"
            d="M28.5.167L23.506 5.16 43.27 24.957H.167v7.084h43.102L23.506 51.84l4.994 4.993L56.833 28.5 28.5.167z"
          />
        )
      };
    case "chevron":
      return {
        viewBox: "0 0 8 12",
        el: (
          <path
            fillRule="evenodd"
            fill="currentcolor"
            clipRule="evenodd"
            d="M1.7 0L.3 1.41 4.88 6 .3 10.59 1.7 12l6-6-6-6z"
          />
        )
      };
    case "clips":
      return {
        viewBox: "0 0 30 30",
        el: (
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            fill="currentcolor"
            d="M3 15C3 8.385 8.385 3 15 3s12 5.385 12 12-5.385 12-12 12S3
            21.615 3 15zm-3 0c0 8.28 6.72 15 15 15 8.28 0 15-6.72 15-15
            0-8.28-6.72-15-15-15C6.72 0 0 6.72 0 15zm19.5 0l-6 6V9l6 6z"
          />
        )
      };
    case "time":
      return {
        viewBox: "0 0 30 30",
        el: (
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            fill="currentcolor"
            d="M14.985 0C6.705 0 0 6.72 0 15c0 8.28 6.705 15 14.985 15C23.28 30 30
            23.28 30 15c0-8.28-6.72-15-15.015-15zM15 27C8.37 27 3 21.63 3 15S8.37 3
            15 3s12 5.37 12 12-5.37 12-12 12zm.75-19.5H13.5v9l7.875 4.725L22.5 19.38l-6.75-4.005V7.5z"
          />
        )
      };
    case "edit":
      return {
        viewBox: "0 0 512 512",
        el: (
          <g>
            <path
              fill="currentcolor"
              d="M459.94 53.25a16.06 16.06 0 00-23.22-.56L424.35 65a8 8 0 000 11.31l11.34 11.32a8 8 0 0011.34 0l12.06-12c6.1-6.09 6.67-16.01.85-22.38zM399.34 90L218.82 270.2a9 9 0 00-2.31 3.93L208.16 299a3.91 3.91 0 004.86 4.86l24.85-8.35a9 9 0 003.93-2.31L422 112.66a9 9 0 000-12.66l-9.95-10a9 9 0 00-12.71 0z"
            />
            <path
              fill="currentcolor"
              d="M386.34 193.66L264.45 315.79A41.08 41.08 0 01247.58 326l-25.9 8.67a35.92 35.92 0 01-44.33-44.33l8.67-25.9a41.08 41.08 0 0110.19-16.87l122.13-121.91a8 8 0 00-5.65-13.66H104a56 56 0 00-56 56v240a56 56 0 0056 56h240a56 56 0 0056-56V199.31a8 8 0 00-13.66-5.65z"
            />
          </g>
        )
      };
    case "search":
      return {
        viewBox: "0 0 512 512",
        el: (
          <g>
            <path
              d="M221.09 64a157.09 157.09 0 10157.09 157.09A157.1 157.1 0 00221.09 64z"
              fill="none"
              stroke="currentColor"
              strokeMiterlimit="10"
              strokeWidth="32"
            />
            <path
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeMiterlimit="10"
              strokeWidth="32"
              d="M338.29 338.29L448 448"
            />
          </g>
        )
      };
    case "pin":
      return {
        viewBox: "0 0 512 512",
        el: (
          <g>
            <circle
              cx="256"
              cy="96"
              r="64"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="32"
            />
            <path
              fill="currentColor"
              d="M272 164a9 9 0 00-9-9h-14a9 9 0 00-9 9v293.56a32.09 32.09 0 002.49 12.38l10.07 24a3.92 3.92 0 006.88 0l10.07-24a32.09 32.09 0 002.49-12.38z"
            />
          </g>
        )
      };
    case "info":
      return {
        viewBox: "0 0 512 512",
        el: (
          <g>
            <path
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="40"
              d="M196 220h64v172"
            />
            <path
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeMiterlimit="10"
              strokeWidth="40"
              d="M187 396h138"
            />
            <path fill="currentColor" d="M256 160a32 32 0 1132-32 32 32 0 01-32 32z" />
          </g>
        )
      };
    case "wifi":
      return {
        viewBox: "0 0 512 512",
        el: (
          <g>
            <path
              d="M332.41 310.59a115 115 0 00-152.8 0M393.46 249.54a201.26 201.26 0 00-274.92 0M447.72 182.11a288 288 0 00-383.44 0"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="32"
            />
            <path fill="currentColor" d="M256 416a32 32 0 1132-32 32 32 0 01-32 32z" />
          </g>
        )
      };
    case "globe":
      return {
        viewBox: "0 0 512 512",
        el: (
          <g>
            <path
              d="M256 48C141.13 48 48 141.13 48 256s93.13 208 208 208 208-93.13 208-208S370.87 48 256 48z"
              fill="none"
              stroke="currentColor"
              strokeMiterlimit="10"
              strokeWidth="32"
            />
            <path
              d="M256 48c-58.07 0-112.67 93.13-112.67 208S197.93 464 256 464s112.67-93.13 112.67-208S314.07 48 256 48z"
              fill="none"
              stroke="currentColor"
              strokeMiterlimit="10"
              strokeWidth="32"
            />
            <path
              d="M117.33 117.33c38.24 27.15 86.38 43.34 138.67 43.34s100.43-16.19 138.67-43.34M394.67 394.67c-38.24-27.15-86.38-43.34-138.67-43.34s-100.43 16.19-138.67 43.34"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="32"
            />
            <path fill="none" stroke="currentColor" strokeMiterlimit="10" strokeWidth="32" d="M256 48v416M464 256H48" />
          </g>
        )
      };
    case "youtube":
      return {
        viewBox: "0 0 443 443",
        el: (
          <g>
            <path fill="#fff" d="M177.582 133.776l.049 175.613 129.993-87.97-130.042-87.643z" />
            <path
              fill="red"
              d="M440.093 128.738c0-38.935-28.639-70.257-64.027-70.257-47.933-2.241-96.818-3.106-146.776-3.106h-15.574c-49.837 0-98.809.865-146.742 3.115-35.302 0-63.94 31.494-63.94 70.43C.87 159.714-.047 190.516.005 221.318c-.086 30.803.894 61.634 2.942 92.494 0 38.935 28.639 70.516 63.94 70.516 50.356 2.337 102.01 3.375 154.529 3.288 52.606.173 104.115-.923 154.529-3.288 35.388 0 64.027-31.581 64.027-70.516 2.076-30.889 3.028-61.691 2.941-92.58a1257.74 1257.74 0 0 0-2.82-92.494zh0zm-260.986 177.46V136.179l125.457 84.966-125.457 85.053z"
            />
          </g>
        )
      };
    case "folder":
      return {
        viewBox: "0 0 512 512",
        el: (
          <path
            fill="currentColor"
            d="M408 96H252.11a23.89 23.89 0 01-13.31-4L211 73.41A55.77 55.77 0 00179.89 64H104a56.06 56.06 0 00-56 56v24h416c0-30.88-25.12-48-56-48zM423.75 448H88.25a56 56 0 01-55.93-55.15L16.18 228.11v-.28A48 48 0 0164 176h384.1a48 48 0 0147.8 51.83v.28l-16.22 164.74A56 56 0 01423.75 448zm56.15-221.45z"
          />
        )
      };
    case "bookmark":
      return {
        viewBox: "0 0 512 512",
        el: (
          <path
            d="M352 48H160a48 48 0 00-48 48v368l144-128 144 128V96a48 48 0 00-48-48z"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="32"
          />
        )
      };
    case "film":
      return {
        viewBox: "0 0 512 512",
        el: (
          <path
            d="M436 80H76a44.05 44.05 0 00-44 44v264a44.05 44.05 0 0044 44h360a44.05 44.05 0 0044-44V124a44.05 44.05 0 00-44-44zM112 388a12 12 0 01-12 12H76a12 12 0 01-12-12v-24a12 12 0 0112-12h24a12 12 0 0112 12zm0-80a12 12 0 01-12 12H76a12 12 0 01-12-12v-24a12 12 0 0112-12h24a12 12 0 0112 12zm0-80a12 12 0 01-12 12H76a12 12 0 01-12-12v-24a12 12 0 0112-12h24a12 12 0 0112 12zm0-80a12 12 0 01-12 12H76a12 12 0 01-12-12v-24a12 12 0 0112-12h24a12 12 0 0112 12zm241.68 124H158.32a16 16 0 010-32h195.36a16 16 0 110 32zM448 388a12 12 0 01-12 12h-24a12 12 0 01-12-12v-24a12 12 0 0112-12h24a12 12 0 0112 12zm0-80a12 12 0 01-12 12h-24a12 12 0 01-12-12v-24a12 12 0 0112-12h24a12 12 0 0112 12zm0-80a12 12 0 01-12 12h-24a12 12 0 01-12-12v-24a12 12 0 0112-12h24a12 12 0 0112 12zm0-80a12 12 0 01-12 12h-24a12 12 0 01-12-12v-24a12 12 0 0112-12h24a12 12 0 0112 12z"
            fill="currentColor"
          />
        )
      };
    case "camera":
      return {
        viewBox: "0 0 512 512",
        el: (
          <path
            d="M464 384.39a32 32 0 01-13-2.77 15.77 15.77 0 01-2.71-1.54l-82.71-58.22A32 32 0 01352 295.7v-79.4a32 32 0 0113.58-26.16l82.71-58.22a15.77 15.77 0 012.71-1.54 32 32 0 0145 29.24v192.76a32 32 0 01-32 32zM268 400H84a68.07 68.07 0 01-68-68V180a68.07 68.07 0 0168-68h184.48A67.6 67.6 0 01336 179.52V332a68.07 68.07 0 01-68 68z"
            fill="currentColor"
          />
        )
      };
    case "trash":
      return {
        viewBox: "0 0 512 512",
        el: (
          <>
            <path d="M296 64h-80a7.91 7.91 0 00-8 8v24h96V72a7.91 7.91 0 00-8-8z" fill="none" />
            <path
              d="M432 96h-96V72a40 40 0 00-40-40h-80a40 40 0 00-40 40v24H80a16 16 0 000 32h17l19 304.92c1.42 26.85 22 47.08 48 47.08h184c26.13 0 46.3-19.78 48-47l19-305h17a16 16 0 000-32zM192.57 416H192a16 16 0 01-16-15.43l-8-224a16 16 0 1132-1.14l8 224A16 16 0 01192.57 416zM272 400a16 16 0 01-32 0V176a16 16 0 0132 0zm32-304h-96V72a7.91 7.91 0 018-8h80a7.91 7.91 0 018 8zm32 304.57A16 16 0 01320 416h-.58A16 16 0 01304 399.43l8-224a16 16 0 1132 1.14z"
              fill="currentColor"
            />
          </>
        )
      };
    case "move":
      return {
        viewBox: "0 0 512 512",
        el: (
          <path
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="32"
            d="M176 112l80-80 80 80M255.98 32l.02 448M176 400l80 80 80-80M400 176l80 80-80 80M112 176l-80 80 80 80M32 256h448"
          />
        )
      };
    default:
      return {
        viewBox: "0 -10 1000 1000",
        el: <text>oops</text>
      };
  }
}
