interface Array<T> {
  toUnique(): string[];
  remove(toRemove: string): string[];
  replace(toReplace: string, replaceWith: string): string[];
}

Array.prototype.toUnique = function (this): string[] {
  return this.filter((v, i, a) => a.indexOf(v) === i);
}

/**
 * Remove an item from an array, identified with its value
 * @param toRemove Item to remove from the array
 */
Array.prototype.remove = function (this, toRemove: string): string[] {
  return this.filter(e => e !== toRemove);
}

/**
 * Replace an item in an array with another
 * @param toReplace Item that is going to be replace
 * @param replaceWith New value for item to replace
 */
Array.prototype.replace = function (this, toReplace: string, replaceWith: string): string[] {
  // Get index of `toReplace` in array and set to `replaceWith`
  this[this.indexOf(toReplace)] = replaceWith;

  return this;
}
