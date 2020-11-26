interface String {
  toReadableDateTime(): string;
  equalsAnyOf(toCompareWith: Array<any>): boolean;
}

/**
 * Convert string of time codes to readable format.
 */
String.prototype.toReadableDateTime = function (this): string {
  let rdt = this;
  let now = new Date();

  //#region DAY

  // Day of the month, 01 to 31
  if (this.includes("%d")) {
    rdt = rdt.replace("%d", now.getDate().toString());
  }

  // Abbreviated day of the week, Mon to Sun
  if (this.includes("%D"))
  {
    rdt = rdt.replace("%D", now.toLocaleString(undefined, { weekday: 'short' }));
  }

  // Full day of the week, Monday to Sunday (%l = lowercase L)
  if (this.includes("%l"))
  {
    rdt = rdt.replace("%l", now.toLocaleString(undefined, { weekday: 'long' }));
  }

  //#endregion

  return rdt.toString();
}

/**
 * Returns true if string equals any of the items in array.
 */
String.prototype.equalsAnyOf = function (this, toCompareWith: Array<any>): boolean {
  return toCompareWith.some((tcw) => tcw === this);
}
