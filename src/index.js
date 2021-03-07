const { app, BrowserWindow, session} = require('electron');
const path = require('path');


require('update-electron-app')({
  repo: 'thereaper90917/youtube_music',
  updateInterval: '1 hour',
  logger: require('electron-log')
})

// Third Party Packages
const { ElectronBlocker, fullLists} = require('@cliqz/adblocker-electron');
const { fetch } = require('cross-fetch');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}
let mainWindow;
const createWindow = async () => {

  // AdBlocker
  const blocker = await ElectronBlocker.fromLists(fetch, fullLists, {
    enableCompression: true,
  });
  blocker.enableBlockingInSession(session.defaultSession);
  
  
  // Create the browser window.
   mainWindow = new BrowserWindow({
    width: 1310,
    height: 800,
    autoHideMenuBar: true ,
    webPreferences:{
      nodeIntegration:true,
      enableRemoteModule:true,
    }
  });
  
  // and load the index.html of the app.
  mainWindow.loadURL('https://music.youtube.com/',
  {userAgent: "Safari/605.1.15"})
  
  

  // Fix For when you play music and try to close
  mainWindow.on('close', function(e) { 
    e.preventDefault();
    mainWindow.destroy();
    });
  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
};


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready',()=>{
  createWindow()
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    console.log('closing')
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

// RPC client ID
const clientId = '817058778628751370';
// DiscordRPC Package
const DiscordRPC = require('discord-rpc');
DiscordRPC.register(clientId);

const rpc = new DiscordRPC.Client({
  transport: 'ipc'
});

let startTimestamp = new Date();
let prevInfo = '';
let prevArgs = [];

function setActivity() {
  if (!rpc || !mainWindow) {
    return;
}
  let currentURL = mainWindow.webContents.getURL();
  let args = mainWindow.getTitle().split(' - ');
  let songinfo = mainWindow.getTitle().replace(/ - YouTube Music/, '').replace(/YouTube Music/, '');
  let smallImage = 'play';
  let details = songinfo;
  let state = 'State: Listening';
  let smallImageText = 'Listening';

  if (prevInfo !== mainWindow.getTitle()) {
    prevInfo = mainWindow.getTitle();

    if (args.length > 1) {
      prevArgs = songinfo;
      startTimestamp = new Date(); 
    }
  }

  if (args.length < 2) {
      smallImage = 'pause';
      smallImageText = 'Paused';
      details = 'unknown';
      state = 'State: Paused';
      buttons = [{
        label: "Download app 💻",
        url: `https://github.com/`,
      }]
  }

  if (args.length > 2) {
    buttons = [{
      label: "Listen to song 🎶",
      url: `${currentURL}`,
    },{
      label: "Download app 💻",
      url: `https://github.com/`,
    }]
  }

  rpc.setActivity({
      details: details,
      buttons: buttons,
      startTimestamp: startTimestamp,
      state: state,
      largeImageKey: 'youtubemusic_logo',
      largeImageText: 'YouTube Music',
      smallImageKey: smallImage,
      smallImageText: smallImageText,
      instance: false,
  });
}

rpc.on('ready', () => {
  setActivity();
  // activity can only be set every 15 seconds
  setInterval(() => {
      setActivity();
  }, 15000);
});

rpc.login({
  clientId
}).catch(console.error);
