/**
 * General helpers
 */
export default class Helpers {
  /**
   * Sleep for certain amount of time.
   * @param timeToSleep Time to sleep in ms.
   */
  public static async sleep(timeToSleep: number) {
    await new Promise((resolve) => setTimeout(resolve, timeToSleep));
  }
}
