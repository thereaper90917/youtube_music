const { app, BrowserWindow, session, Menu,} = require('electron');
const path = require('path');
const {newWindow} = require('./Menu/Menu_JS//about')
const elogger = require('electron-log')




// setup for custom logs
const log = require('electron-log');
log.transports.file.level = 'error';
log.transports.file.resolvePath = () => 'ErrorsLog.log';



require('update-electron-app-notification')({
  repo: 'thereaper90917/youtube_music',
  updateInterval: '1 hour',
  logger: require('electron-log'),
  userNotification: true,
  userNotificationMessage: "test",
  userNotificationTime:"5"
})

// Third Party Packages
const { ElectronBlocker, fullLists} = require('@cliqz/adblocker-electron');
const { fetch } = require('cross-fetch');
const { remote } = require('electron/renderer');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

let loadingWindow = null
let mainWindow;
const createWindow = async () => {


  try {
      // AdBlocker
      const blocker = await ElectronBlocker.fromLists(fetch, fullLists, {
      enableCompression: true,
    });
      blocker.enableBlockingInSession(session.defaultSession);
  } catch (error) {
    log.error(`Adblock Error: ${error}`)
  }
  
  
  
  // Create the browser window.
   mainWindow = new BrowserWindow({
    useContentSize: 400,
    width: 1310,
    height: 800,
    frame: false,
    autoHideMenuBar:true,
    // autoHideMenuBar: true ,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      enableRemoteModule: true,
      nodeIntegration: true,
      contextIsolation: false,
      
    }
  });
  
  // and load the index.html of the app.
  mainWindow.loadURL('https://music.youtube.com/',
  {userAgent: "Safari/605.1.15"})
  
  
  // Injecting Css into loadurl.
  mainWindow.webContents.on('did-finish-load', function() {
    mainWindow.webContents.insertCSS(`ytmusic-nav-bar {
      margin-top:20px;
      display: flex;
      height: var(--ytmusic-nav-bar-height);
      box-sizing: border-box;
      padding: 0 16px;
      align-items: center;
      justify-content: space-between;
      --ytmusic-nav-bar-tab-margin: 24px;
  }`)
  mainWindow.webContents.insertCSS(`::-webkit-scrollbar {
    width: 14px;
    background:rgb(20, 19, 19);
  }`)
  mainWindow.webContents.insertCSS(`::-webkit-scrollbar-thumb {
    background-color: red;    /* color of the scroll thumb */
    /* border-radius: 20px;       roundness of the scroll thumb */
    border: 4px solid rgb(20, 19, 19);
  }`)
    
 });


 // Destroys Loading Window
  loadingWindow.hide()
  loadingWindow.destroy()

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

  loadingWindow = new BrowserWindow({
    width: 600,
    height: 400,
    frame : false,
    movable : false,
  })

  loadingWindow.loadFile(path.join(__dirname, 'loader.html')) // To load the activity loader html file
  loadingWindow.show();
  createWindow()

  // Menu for App
  const template = [
    {
      label:  'Settings',
      submenu:[
        // {
        //   // TODO still have to add functionality
        //   label:
        //   'User Settings',
        // },
          {
          label:
          'About',
          click: ()=>{
            newWindow()
          }
        }
      ]
    }
  ]
  
  
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
});




// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
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
// const clientId = '817058778628751370';
// // DiscordRPC Package
// const DiscordRPC = require('discord-rpc');
// const { electron } = require('process');
// DiscordRPC.register(clientId);

// const rpc = new DiscordRPC.Client({
//   transport: 'ipc'
// });

// let startTimestamp = new Date();
// let prevInfo = '';
// let prevArgs = [];

// function setActivity() {
//   if (!rpc || !mainWindow) {
//     return;
// }
//   let currentURL = mainWindow.webContents.getURL();
//   let args = mainWindow.getTitle().split(' - ');
//   let songinfo = mainWindow.getTitle().replace(/ - YouTube Music/, '').replace(/YouTube Music/, '');
//   let smallImage = 'play';
//   let details = songinfo;
//   let state = 'State: Listening';
//   let smallImageText = 'Listening';

//   if (prevInfo !== mainWindow.getTitle()) {
//     prevInfo = mainWindow.getTitle();

//     if (args.length > 1) {
//       prevArgs = songinfo;
//       startTimestamp = new Date(); 
//     }
//   }

//   if (args.length < 2) {
//       smallImage = 'pause';
//       smallImageText = 'Paused';
//       details = 'unknown';
//       state = 'State: Paused';
//       buttons = [{
//         label: "Download app 💻",
//         url: `https://github.com/thereaper90917/youtube_music/releases`,
//       }]
//   }

//   if (args.length > 2) {
//     buttons = [{
//       label: "Download app 💻",
//       url: `https://github.com/thereaper90917/youtube_music/releases`,
//     }]
//   }

//   rpc.setActivity({
//       details: details,
//       buttons: buttons,
//       startTimestamp: startTimestamp,
//       state: state,
//       largeImageKey: 'youtubemusic_logo',
//       largeImageText: 'YouTube Music',
//       smallImageKey: smallImage,
//       smallImageText: smallImageText,
//       instance: false,
//   });
// }

// rpc.on('ready', () => {
//   setActivity();
//   // activity can only be set every 15 seconds
//   setInterval(() => {
//       setActivity();
//   }, 15000);
// });

// rpc.login({
//   clientId
// }).catch(console.error);
