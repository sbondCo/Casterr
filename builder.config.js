/**
 * Electron Builder Config.
 */

/**
 * @type {import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configuration
 */
const config = {
  appId: "sbondCo.Casterr",
  productName: "Casterr",
  copyright: "Copyright © 2022 sbondCo",
  compression: "maximum",
  linux: {
    target: ["AppImage"],
    icon: "assets/icons",
    category: "Utility",
    synopsis: "Screen recorder",
    description: "Easy screen recording and sharing"
  },
  win: {
    target: "NSIS",
    artifactName: "${productName} ${version} Setup.${ext}",
    icon: "assets/icons/256x256.ico"
  },
  files: ["./dist/vi/**", "./entry/out/**"],
  extraFiles: [
    {
      from: "./assets",
      to: "./assets",
      filter: ["**/*"]
    }
  ],
  directories: {
    output: "./dist/eb",
    buildResources: "buildResources"
  }
};

module.exports = config;
