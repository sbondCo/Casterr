import Pulse from "./pulse";
import FFmpeg from "./ffmpeg";
import { ipcRenderer, Display } from "electron";

export interface Devices {
  /**
   * Audio devices.
   * Microphones, headsets, etc.
   */
  audio: AudioDevice[];

  /**
   * Video devices.
   * Used to store video devices such as for example a webcam.
   * Also stores device that ffmpeg uses to record desktop on windows.
   * Currently not in use on Linux.
   */
  video: string[];
}

export interface AudioDevice {
  /**
   * Source number
   *  - On  **Linux** used to store source number of audio device and as key for ListBox
   *  - On **Windows** used only as a key for ListBox (currently set as the name as device name)
   */
  id: number | string;

  /**
   * Name of device.
   * Usually the same as ID, but in certain cases will
   * contain a more reader friendly version of the devices name.
   */
  name: string;

  /**
   * If device is an input (microphone) or output (speaker).
   */
  isInput?: boolean;
}

export default class DeviceManager {
  public static readonly winDesktopVideoDevice = "screen-capture-recorder";
  public static readonly winDesktopAudioDevice = "virtual-audio-capturer";

  /**
   * Get audio and video devices that can be recorded with FFmpeg.
   * Automatically gets correct devices depending on current OS.
   */
  public static async getDevices() {
    if (process.platform === "win32") return await this.getWindowsDevices();
    else if (process.platform === "linux") return await this.getLinuxDevices();

    throw new Error("Could not get devices for current system. It isn't supported.");
  }

  /**
   * Get devices from Linux.
   */
  private static async getLinuxDevices() {
    return await new Promise<Devices>((resolve, reject) => {
      const pulse = new Pulse();
      const audioDevices = new Array<AudioDevice>();

      pulse
        .run("list sources", {
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
                    id: sourceNumber,
                    name: l.replace("alsa.card_name = ", "").replaceAll('"', "").replaceAll("\t", ""),
                    isInput: isInputDevice
                  });
                }
              });
          },
          onExitCallback: async () => {
            resolve({
              audio: audioDevices,
              // Currently getting over video devices is not supported on Linux.
              video: []
            });
          }
        })
        .catch((e) => reject(e));
    });
  }

  /**
   * Get devices from Windows.
   */
  private static async getWindowsDevices() {
    return await new Promise<Devices>((resolve, reject) => {
      const ffmpeg = new FFmpeg();
      const audioDevices = new Array<AudioDevice>();
      const videoDevices = new Array<string>();
      let isAudioDevice = false;

      ffmpeg
        .run("-list_devices true -f dshow -i dummy", "onExit", {
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
                  let val = match[0].trim().replaceAll('"', "");
                  let name = val; // By default name will be same as `val`

                  // Add devices to correct List, if they aren't skipped above
                  if (isAudioDevice) {
                    // If Desktop Audio device, then change name to an understandable one
                    if (val === this.winDesktopAudioDevice) {
                      name = "Desktop Audio";
                    }

                    audioDevices.push({
                      // Use device name as ID for windows
                      id: val,
                      name
                    });
                  } else {
                    // If Desktop Screen video device, then add under different name
                    if (val === this.winDesktopVideoDevice) {
                      val = "Desktop Screen";
                    }

                    videoDevices.push(val);
                  }
                }
              });
          },
          onExitCallback: async () => {
            resolve({
              audio: audioDevices,
              video: videoDevices
            });
          }
        })
        .catch((e) => reject(e));
    });
  }

  /**
   * Get all monitors.
   */
  public static async getMonitors(): Promise<Display[]> {
    return await ipcRenderer.invoke("get-screens");
  }

  /**
   * Get specific monitor.
   * @param id id of wanted monitor.
   */
  public static async findMonitor(id: string): Promise<Display> {
    return (await this.getMonitors()).filter((e) => e.id.toString() === id)[0];
  }

  /**
   * Get primary monitor.
   */
  public static async getPrimaryMonitor(): Promise<Display> {
    return await ipcRenderer.invoke("get-primary-screen");
  }
}
