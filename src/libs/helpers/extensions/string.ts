/**
 * Convert string of time codes to readable format.
 */
export function toReadableDateTime(str: string): string {
  let rdt = str;
  const now = new Date();

  // Day

  // Day of the month, 01 to 31
  if (str.includes("%d")) {
    rdt = rdt.replace("%d", now.getDate().toString());
  }

  // Abbreviated day of the week, Mon to Sun
  if (str.includes("%D")) {
    rdt = rdt.replace("%D", now.toLocaleString(undefined, { weekday: "short" }));
  }

  // Full day of the week, Monday to Sunday (%l = lowercase L)
  if (str.includes("%l")) {
    rdt = rdt.replace("%l", now.toLocaleString(undefined, { weekday: "long" }));
  }

  // Month

  // Numeric representation of the month, 01 to 12
  if (str.includes("%m")) {
    rdt = rdt.replace("%m", now.toLocaleString(undefined, { month: "numeric" }));
  }

  // Abbreviated month, Jan to Dec
  if (str.includes("%M")) {
    rdt = rdt.replace("%M", now.toLocaleString(undefined, { month: "short" }));
  }

  // Full month, January to December
  if (str.includes("%F")) {
    rdt = rdt.replace("%F", now.toLocaleString(undefined, { month: "long" }));
  }

  // Year

  // Two digit representation of the year, 80 or 20
  if (str.includes("%y")) {
    rdt = rdt.replace("%y", (now.getFullYear() % 100).toString());
  }

  // Full numeric representation of the year, 1980 or 2020
  if (str.includes("%Y")) {
    rdt = rdt.replace("%Y", now.toLocaleString(undefined, { year: "numeric" }));
  }

  // Time

  // Hour of the day (12-hour format), 01 to 12
  if (str.includes("%h")) {
    // Get hour of day in 12 hour format, removing 'am', 'pm' and any whitespace.
    rdt = rdt.replace("%h", now.toLocaleString(undefined, { hour12: true, hour: "numeric" }).replace(/am|pm| /g, ""));
  }

  // Hour of the day (24-hour format), 00 to 23
  if (str.includes("%H")) {
    rdt = rdt.replace("%H", now.getHours().toString());
  }

  // Minutes since start of the hour, 00 to 59
  if (str.includes("%i")) {
    rdt = rdt.replace("%i", now.getMinutes().toString());
  }

  // Seconds since start of the minute, 00 to 59
  if (str.includes("%s")) {
    rdt = rdt.replace("%s", now.getSeconds().toString());
  }

  // Lowercase Ante Meridiem and Post Meridiem, am or pm
  if (str.includes("%a")) {
    rdt = rdt.replace("%a", now.getHours() < 12 ? "am" : "pm");
  }

  // Uppercase Ante Meridiem and Post Meridiem, AM or PM
  if (str.includes("%A")) {
    rdt = rdt.replace("%A", now.getHours() < 12 ? "AM" : "PM");
  }

  // Timezone

  // Difference to Greenwich time, BST = +0100
  if (str.includes("%O")) {
    const tzoh = Math.abs(now.getTimezoneOffset() / 60);
    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
    rdt = rdt.replace("%O", (-now.getTimezoneOffset() < 0 ? "-" : "+") + (tzoh < 10 ? "0" : "") + tzoh + "00");
  }

  return rdt.toString();
}

/**
 * Returns true if string equals any of the items in array.
 */
export function equalsAnyOf(str: string, toCompareWith: string[]): boolean {
  return toCompareWith.some((rdtw) => rdtw === str);
}
