import childProcess from "child_process";

/**
 * Manage registry entries on Windows.
 * TODO: Throw error if initialised on non-windows machine.
 */
export default class Registry {
  constructor(private path: string) {}

  public async add(name: string, value: string | number, type: keyof RegistryTypes, overwrite: boolean = true) {
    await this.run(`add ${this.path} /v ${name} /t ${type} /d ${value} ${overwrite ? "/f" : ""}`);
  }

  private async run(cmd: string) {
    return new Promise((resolve, reject) => {
      const cp = childProcess.exec(`reg ${cmd}`);

      cp.on("exit", (code) => {
        if (code == 0) {
          resolve(code);
        } else {
          reject(code);
        }
      });
    });
  }
}

/**
 * Types of registry entries.
 * Add more when needed: https://docs.microsoft.com/en-us/windows/win32/sysinfo/registry-value-types
 */
export interface RegistryTypes {
  REG_BINARY: string;
  REG_DWORD: string;
  REG_NONE: string;
  REG_QWORD: string;
}
