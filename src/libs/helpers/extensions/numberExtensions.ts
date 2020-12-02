interface Number {
  toReadableTimeFromSeconds(): string;
  toReadableFileSize(): string;
}

Number.prototype.toReadableTimeFromSeconds = function (this: number): string {
  // Get days, hours, minutes and seconds from total seconds
  let d = Math.floor(this / (3600*24));
  let h = Math.floor(this % (3600*24) / 3600);
  let m = Math.floor(this % 3600 / 60);
  let s = Math.floor(this % 60);
  
  // Turn into readable format
  let dDisplay = d > 0 ? d + ":" : "";
  let hDisplay = h > 0 ? h + ":" : "";
  let mDisplay = m > 0 ? m + ":" : "";
  let sDisplay = s > 0 ? s + "" : "";

  // Return readable format
  return dDisplay + hDisplay + mDisplay + sDisplay;
}

Number.prototype.toReadableFileSize = function (this: number): string {
  let i = Math.floor(Math.log(this) / Math.log(1024));

  // Tell me who else supports yottabytes
  return Math.round((this / Math.pow(1024, i))) * 1 + " " + ["B", "kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"][i];
}
