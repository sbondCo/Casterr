import Pulse from "./pulse";
import FFmpeg from "./ffmpeg";

export interface AudioDevice {
  // Source number
  // On Linux used to store source number of audio device and as key for ListBox
  // On Windows used only as a key for ListBox (currently set as the name as device name)
  ID: number | string;

  // Name of device.
  // Usually the same as ID, but in certain cases will
  // contain a more reader friendly version of the devices name.
  name: string;

  // Is an input device
  isInput?: boolean;
}

export default class DeviceManager {
  public static readonly winDesktopVideoDevice = "screen-capture-recorder";
  public static readonly winDesktopAudioDevice = "virtual-audio-capturer";

  /**
   * Get audio and video devices that can be recorded with FFmpeg.
   * Automatically gets correct devices depending on current OS.
   */
  public static getDevices() {
    if (process.platform == "win32") return this.getWindowsDevices();
    else if (process.platform == "linux") return this.getLinuxDevices();

    throw new Error("Could not get devices for current system. It isn't supported.");
  }

  /**
   * Get devices from Linux.
   */
  private static getLinuxDevices() {
    return new Promise<{ audioDevices: AudioDevice[]; videoDevices: string[] }>((resolve) => {
      const pulse = new Pulse();
      const audioDevices = new Array<AudioDevice>();

      pulse.run("list sources", {
        stdoutCallback: (out: string) => {
          // If current device is an input device (eg. microphone)
          let isInputDevice = false;
          let sourceNumber = 0;

          // Find audioDevices and add them to audioDevices array
          out
            .split(/\r\n|\r|\n/g)
            .filter((l) => l !== "")
            .forEach((l: string) => {
              const ll = l.toLowerCase();

              // Get source number
              if (ll.includes("source")) {
                sourceNumber = parseInt(ll.replace("source #", ""), 10);
              }

              if (ll.includes("name: alsa_input")) isInputDevice = true;
              if (ll.includes("name: alsa_output")) isInputDevice = false;

              if (ll.includes("alsa.card_name")) {
                // Add input devices to audioDevices array
                audioDevices.push({
                  ID: sourceNumber,
                  name: l
                    .replace("alsa.card_name = ", "")
                    .replaceAll('"', "")
                    .replaceAll("\t", ""),
                  isInput: isInputDevice
                });
              }
            });
        },
        onExitCallback: () => {
          resolve({
            audioDevices: audioDevices,
            // Currently getting over video devices is not supported on Linux.
            videoDevices: []
          });
        }
      });
    });
  }

  /**
   * Get devices from Windows.
   */
  private static getWindowsDevices() {
    return new Promise<{ audioDevices: AudioDevice[]; videoDevices: Array<string> }>((resolve) => {
      const ffmpeg = new FFmpeg();
      const audioDevices = new Array<AudioDevice>();
      const videoDevices = new Array<string>();
      let isAudioDevice = false;

      ffmpeg.run("-list_devices true -f dshow -i dummy", {
        stderrCallback: (out: string) => {
          out
            .split(/\r\n|\r|\n/g)
            .filter((l) => l !== "")
            .forEach((l: string) => {
              const ll = l.toLowerCase();

              // Check if next devices to be looked at will be audio or video
              if (ll.includes("] directshow video devices")) {
                isAudioDevice = false;
                return;
              }

              if (ll.includes("] directshow audio devices")) {
                isAudioDevice = true;
                return;
              }

              // Skip line if it is a device alternate name
              if (ll.includes("@device")) {
                return;
              }

              // Check for matches to regex
              const match = l.match(/(?!\[dshow @ \w+\]) {2}"(.+)"/g);

              if (match) {
                // Trim and remove all speech marks from the match
                let val = match[0].trim().replaceAll(`"`, "");
                let name = val; // By default name will be same as `val`

                // Add devices to correct List, if they aren't skipped above
                if (isAudioDevice) {
                  // If Desktop Audio device, then change name to an understandable one
                  if (val == this.winDesktopAudioDevice) {
                    name = "Desktop Audio";
                  }

                  audioDevices.push({
                    // Use device name as ID for windows
                    ID: val,
                    name: val
                  });
                } else {
                  // If Desktop Screen video device, then add under different name
                  if (val == this.winDesktopVideoDevice) {
                    val = "Desktop Screen";
                  }

                  videoDevices.push(val);
                }
              }
            });
        },
        onExitCallback: () => {
          resolve({
            audioDevices: audioDevices,
            videoDevices: videoDevices
          });
        }
      });
    });
  }
}
