interface Number {
  toReadableFromSeconds(): string;
}

Number.prototype.toReadableFromSeconds = function (this: number): string {
  // Get days, hours, minutes and seconds from total seconds
  let d = Math.floor(this / (3600*24));
  let h = Math.floor(this % (3600*24) / 3600);
  let m = Math.floor(this % 3600 / 60);
  let s = Math.floor(this % 60);
  
  // Turn into readable format
  let dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
  let hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
  let mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
  let sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";

  // Return readable format
  return dDisplay + hDisplay + mDisplay + sDisplay;
}
