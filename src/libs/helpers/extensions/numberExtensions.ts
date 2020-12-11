interface Number {
  /**
   * Convert time in seconds to a readable string.
   */
  toReadableTimeFromSeconds(): string;
  /**
   * Convert bytes to readable file size string.
   */
  toReadableFileSize(): string;
}

Number.prototype.toReadableTimeFromSeconds = function (this: number): string {
  // Get days, hours, minutes and seconds from total seconds
  const d = Math.floor(this / (3600*24));
  const h = Math.floor(this % (3600*24) / 3600);
  const m = Math.floor(this % 3600 / 60);
  const s = Math.floor(this % 60);
  
  // Turn into readable format
  const dDisplay = d > 0 ? (d < 10 ? "0" + d : d) + ":" : "";
  const hDisplay = h > 0 ? (h < 10 ? "0" + h : h) + ":" : "";
  const mDisplay = m > 0 ? (m < 10 ? "0" + m : m) + ":" : "00:";
  const sDisplay = s > 0 ? (s < 10 ? "0" + s : s) : "00";

  // Return readable format
  return dDisplay + hDisplay + mDisplay + sDisplay;
}

Number.prototype.toReadableFileSize = function (this: number): string {
  const i = Math.floor(Math.log(this) / Math.log(1024));

  // Tell me who else supports yottabytes
  return Math.round((this / Math.pow(1024, i))) * 1 + " " + ["B", "kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"][i];
}
