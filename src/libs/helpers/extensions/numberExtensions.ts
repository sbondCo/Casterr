interface Number {
  toReadableFromSeconds(): string;
}

Number.prototype.toReadableFromSeconds = function (this: number): string {
  // Get days, hours, minutes and seconds from total seconds
  let d = Math.floor(this / (3600*24));
  let h = Math.floor(this % (3600*24) / 3600);
  let m = Math.floor(this % 3600 / 60);
  let s = Math.floor(this % 60);

  // Return in readable format
  return `
    ${d > 0 ? d + (d == 1 ? " day, " : " days, ") : ""}
    ${h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : ""}
    ${m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : ""}
    ${s > 0 ? s + (s == 1 ? " second" : " seconds") : ""}
  `;
}
