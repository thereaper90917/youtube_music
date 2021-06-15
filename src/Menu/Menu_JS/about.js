const { app, BrowserWindow } = require("electron");
const path = require("path");
const appMetaData = require("../../../package.json");

let aboutWindow = null;

const newWindow = async () => {
  // if (aboutWindow) {
  //     aboutWindow.focus()
  //     return
  //   }

  // Create the browser window.
  aboutWindow = new BrowserWindow({
    width: 550,
    height: 450,
    title: "About",
    resizable: false,
    frame: false,
    vibrancy: "ultra-dark",
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "../../preload.js"),
      enableRemoteModule: true,
      nodeIntegration: true,
      contextIsolation: false,
      devTools: false,
    },
  });
  // and load the index.html of the app.
  aboutWindow.loadURL(path.join(__dirname, "../Menu_Html/about.html"));
  // Sending Version from Package.json to about.html
  aboutWindow.webContents.send("version", appMetaData.version);

  // Fix For when you play music and try to close
  aboutWindow.on("close", function (e) {
    e.preventDefault();
    aboutWindow.destroy();
  });
  // Open the DevTools.
  // aboutWindow.webContents.openDevTools();
};

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

exports.newWindow = newWindow;
