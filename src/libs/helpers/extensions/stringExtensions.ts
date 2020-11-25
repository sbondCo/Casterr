interface String {
  toReadableDateTime(): string;
  equalsAnyOf(toCompareWith: Array<any>): boolean;
}

/**
 * Convert string of time codes to readable format.
 */
String.prototype.toReadableDateTime = function (this): string {
  return "hi";
}

/**
 * Returns true if string equals any of the items in array.
 */
String.prototype.equalsAnyOf = function (this, toCompareWith: Array<any>): boolean {
  return toCompareWith.some((tcw) => tcw === this);
}
