module.exports = {
  css: {
    loaderOptions: {
      sass: {
        additionalData: `
          @import "./src/styles/_vars.scss";
          @import "./src/styles/_norm.scss";
        `
      }
    }
  },
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      builderOptions: {
        appId: "CasterrTV.Casterr",
        productName: "Casterr",
        copyright: "Copyright © 2020 CasterrTV",
        compression: "maximum",
        linux: {
          target: ["AppImage"],
          icon: "./icons",
          category: "Utility",
          synopsis: "Screen recorder",
          description: "Easy screen recording and sharing"
        },
        win: {
          target: "NSIS",
          artifactName: "${productName} ${version} Setup.${ext}",
          icon: "./icons/256x256.ico"
        }
      }
    }
  }
}
