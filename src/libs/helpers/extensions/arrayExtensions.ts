interface Array<T> {
  /**
   * Remove an item from an array, identified with its value
   * @param toRemove Item to remove from the array
   */
  remove(toRemove: string | number | object): any[];
  /**
   * Replace an item in an array, identified with its value
   * @param toRemove Item to remove from the array
   */
  replace(toReplace: string, replaceWith: string): string[];
}

Array.prototype.remove = function(this, toRemove: string | number | object): any[] {
  return this.filter((e) => JSON.stringify(e) !== JSON.stringify(toRemove));
};

Array.prototype.replace = function(this, toReplace: string, replaceWith: string): string[] {
  // Get index of `toReplace` in array and set to `replaceWith`
  this[this.indexOf(toReplace)] = replaceWith;

  return this;
};
