import { useState } from "react";

/**
 * Debouncer.
 * @param ms Delay in milliseconds.
 */
export default function useDebouncer(ms: number = 250) {
  const [debouncer, setDebouncer] = useState<NodeJS.Timeout>();

  /**
   * Call this method everytime the action you want to delay
   * happens with the updated callback for the debouncer to work correctly.
   * @param callback Callback to run if an action successully runs down the `ms` delay without being cancelled.
   */
  const doDebounce = (callback: () => void) => {
    clearInterval(debouncer);
    setDebouncer(
      setTimeout(() => {
        callback();
      }, ms)
    );
  };

  return {
    doDebounce
  };
}
