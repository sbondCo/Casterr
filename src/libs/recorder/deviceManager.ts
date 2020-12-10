import Pulse from "./pulse";
import FFmpeg from "./ffmpeg";

export interface AudioDevice {
  // Source number
  ID: number,

  // Name of device
  name: string,

  // Is an input device
  isInput?: boolean;
}

export default class DeviceManager {
  public static getDevices() {
    return this.getLinuxDevices();
  }

  private static getLinuxDevices() {
    const pulse = new Pulse();
    const audioDevices = new Array<AudioDevice>();

    pulse.run("list sources", {
      stdoutCallback: (out: string) => {
        // If current device is an input device (eg. microphone)
        let isInputDevice = false;
        let sourceNumber = 0;

        // Find audioDevices and add them to audioDevices array
        out.toLowerCase().split(/\r\n|\r|\n/g).filter(l => l !== "").forEach((l: string) => {
          l = l.toLowerCase();

          // Get source number
          if (l.includes("source")) {
            sourceNumber = parseInt(l.replace("source #", ""));
          }

          if (l.includes("name: alsa_input")) isInputDevice = true;
          if (l.includes("name: alsa_output")) isInputDevice = false;

          if (l.includes("alsa.card_name")) {
            // Add input devices to audioDevices array
            audioDevices.push({
              ID: sourceNumber,
              name: l
                .replace("alsa.card_name = ", "")
                .replace("\"", "")
                .replace("\t", ""),
              isInput: isInputDevice
            });
          }
        });
      }
    });

    return {
      audioDevices: audioDevices,
      videoDevices: ""
    }
  }

  private static getWindowsDevices() {
    const ffmpeg = new FFmpeg();
    const audioDevices = new Array<AudioDevice>();
    const videoDevices = new Array<string>();

    const desktopVideoDevice = "screen-capture-recorder";
    let isAudioDevice = false;
    let currentIteration = 0;

    ffmpeg.run("-list_devices true -f dshow -i dummy", {
      stdoutCallback: (out: string) => {
        out.toLowerCase().split(/\r\n|\r|\n/g).filter(l => l !== "").forEach((l: string) => {
          l = l.toLowerCase();

          // Check if next devices to be looked at will be audio or video
          if (l.includes("] directshow video devices")) {
            isAudioDevice = false;
            return;
          }

          if (l.includes("] directshow audio devices")) {
            isAudioDevice = true;
            return;
          }

          // Skip line if it is a device alternate name
          if (l.includes("@device")) {
            return;
          }

          // Check for matches to regex
          const match = l.match(`[dshow @ w+]  ""(.+)""`);

          if (match) {
            // Remove all speech marks from line
            const val = match[1];

            // If Desktop Screen Video Device, then add to
            // videoDevices under different name
            if (val.includes(desktopVideoDevice)) {
              videoDevices.push("Desktop Screen");
              return;
            }

            // Add devices to correct List, if they aren't skipped above
            if (isAudioDevice) {
              audioDevices.push({
                // Use currentIteration as device ID for now
                // ! This may cause a bug that requires users to re-apply all active devices if plugging in a new device.
                ID: currentIteration,
                name: val
              });
            }
            else {
              videoDevices.push(val);
            }
          }

          currentIteration++;
        });
      }
    });

    return {
      audioDevices: audioDevices,
      videoDevices: videoDevices
    }
  }
}
