import childProcess from "child_process";

export default class Pulse {
  private pulseProcess?: childProcess.ChildProcess;

  /**
   * Run pactl and send arguments to it.
   * @param args args to send to pactl.
   * @param outputs Holds optional callback functions with outputs from pactl.
   */
  public async run(
    args: string,
    outputs?: {
      stdoutCallback?: CallableFunction;
      stderrCallback?: CallableFunction;
      onExitCallback?: CallableFunction;
    }
  ) {
    // pactl path
    const pulsePath = "pactl";

    let stdout = "";

    // Create child process and send args to it
    this.pulseProcess = childProcess.exec(`${pulsePath} ${args}`);

    // Run stdoutCallback when recieving stdout
    this.pulseProcess.stdout!.on("data", (data) => {
      // Collect all stdout and store in 'stdout' variable
      stdout += data;
    });

    // Run stderrCallback when recieving stderr
    this.pulseProcess.stderr!.on("data", (data) => {
      if (outputs?.stderrCallback != undefined) outputs?.stderrCallback(data);
    });

    // When pulseProcess exits
    this.pulseProcess.on("close", (code) => {
      // After pulse exits, send all stdout as one string through callback function.
      // This ensures that the stdout isn't sent back as multiple strings, which
      // could result in not being able to find what you need.
      if (outputs?.stdoutCallback != undefined) outputs?.stdoutCallback(stdout);

      // Call onExitCallback is set to do so
      if (outputs?.onExitCallback != undefined) outputs?.onExitCallback();
    });
  }
}
