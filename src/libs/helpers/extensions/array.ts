/**
 * Remove an item from an array, identified with it's value.
 * @param toRemove Item to remove from the array.
 */
export function remove(arr: any[], toRemove: string | number | object): any[] {
  return arr.filter((e) => JSON.stringify(e) !== JSON.stringify(toRemove));
}

/**
 * Remove the first occurance of an item from an array, identified with it's value.
 * @param toRemove Item to remove from the array.
 */
export function removeFirst(arr: any[], toRemove: string | number | object): any[] {
  arr.splice(arr.indexOf(toRemove), 1);
  return arr;
}

/**
 * Replace an item in an array, identified with its value.
 * @param toRemove Item to remove from the array.
 */
export function replace(arr: any[], toReplace: string | object, replaceWith: string | object): string[] {
  arr[arr.findIndex((e) => e === toReplace)] = replaceWith;
  return arr;
}
