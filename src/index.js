const { app, BrowserWindow } = require('electron');
const path = require('path');
// `````````````````````````````````````````````````````````
const { execSync, exec, spawn } = require("child_process");
const log = require('electron-log');
log.transports.file.level = 'info';
log.transports.file.resolvePath = () => __dirname + "/log.log";
var fs = require('fs'), out = fs.openSync('./out.log', 'a'), err = fs.openSync('./out.log', 'a');

const Yagna_Source = path.join(path.dirname('golem-resources'))
const Yagna_EVN = ("set PATH=%PATH%;"+Yagna_Source, "set ELECTRON_ENABLE_LOGGING=1")
var Yagna_Start=(Yagna_EVN, "yagna service run");
var Yagna_Pay=("set YAGNA_APPKEY=2797bf88cb814986b047a9db79b99018", "yagna payment init --sender")
var Yagna_Status=("yagna payment status")
//``````````````````````````````````````````````````````````

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  // eslint-disable-line global-require
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  //mainWindow.webContents.openDevTools();
  
  //Function to give time for Yagna to fully start
  function Yagna_stat_pay () {
    setTimeout(function () {
      exec(Yagna_Status, Yagna_Pay, (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          return;
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
      }, 5000);
    })
  };

  //Start Yagna service
  exec(Yagna_Start, {stdio: ['ignore', out, err], detached: true}).unref();

  //Check Yagna Payment status and set to sender mode
  Yagna_stat_pay
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready',createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    exec('taskkill /IM "yagna.exe" /F'); // Ensures Yagna closes with app
    app.quit();
  }
});
