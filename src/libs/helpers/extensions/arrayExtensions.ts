interface Array<T> {
  /**
   * Remove an item from an array, identified with it's value.
   * @param toRemove Item to remove from the array.
   */
  remove(toRemove: string | number | object): any[];
  /**
   * Remove the first occurance of an item from an array, identified with it's value.
   * @param toRemove Item to remove from the array.
   */
  removeFirst(toRemove: string | number | object): any[];
  /**
   * Replace an item in an array, identified with its value.
   * @param toRemove Item to remove from the array.
   */
  replace(toReplace: string, replaceWith: string): string[];
}

Array.prototype.remove = function(this, toRemove: string | number | object): any[] {
  return this.filter((e) => JSON.stringify(e) !== JSON.stringify(toRemove));
};

Array.prototype.removeFirst = function(this, toRemove: string | number | object): any[] {
  this.splice(this.indexOf(toRemove), 1);
  return this;
};

Array.prototype.replace = function(this, toReplace: string, replaceWith: string): string[] {
  // Get index of `toReplace` in array and set to `replaceWith`
  this[this.indexOf(toReplace)] = replaceWith;

  return this;
};
