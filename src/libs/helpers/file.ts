import { promises as fs } from "fs";

/**
 * File related helpers.
 */
export default class File {
  /**
   * Read a continuous JSON file (eg. Recordings.json).
   * A continuous JSON file being one that emits the { } that wraps
   * the json (making it invalid markup) so that new objects can be
   * written to the end of file without needing to rewrite the entire file.
   */
  public static async readContinuousJsonFile(path: string) {
    // Get all videos from appropriate json file
    const data = await fs.readFile(path, "utf8");

    // Parse JSON from file and assign it to recordings variable.
    // Because it is stored in a way so that we don't have to read the file
    // before writing to it, we need to prepare the data in the file before it is parsable JSON.
    // 1. Make into array by wrapping [square brackets] around it.
    // 2. If last letter in data is a ',' then remove it.
    return JSON.parse(`[${data.slice(-1) === "," ? data.slice(0, -1) : data}]`);
  }
}
