const { app, BrowserWindow, ipcMain, webContents } = require('electron');
const path = require('path');
// `````````````````````````````````````````````````````````
const { execSync, exec, spawn } = require("child_process");
const log = require('electron-log');
log.transports.file.level = 'info';
log.transports.file.resolvePath = () => __dirname + "/log.log";
var fs = require('fs'), out = fs.openSync('./out.log', 'a'), err = fs.openSync('./out.log', 'a');

const Yagna_Source = path.join(path.dirname('golem-resources'))
//``````````````````````````````````````````````````````````

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  // eslint-disable-line global-require
  app.quit();
}

const createWindow = () => {
  
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    show: false,
    width: 1000,
    height: 675,
    useContentSize: true,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      enableRemoteModule: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // and load the index.html of the app.
  //mainWindow.loadFile(path.join(__dirname, 'index.html'));

  //Load Loading screen
  mainWindow.loadFile(path.join(__dirname, 'index.html'))
  mainWindow.center();

  var splash = new BrowserWindow({
    transparent: false, 
    frame: false, 
    alwaysOnTop: true,
    width: 1000,
    height: 675,
    useContentSize: true,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      enableRemoteModule: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  splash.loadFile(path.join(__dirname, 'loading.html'));
  splash.center();

  // Open the DevTools.
  //mainWindow.webContents.openDevTools();

  //Start Yagna service
  const Yagna_Start = spawn('yagna', ['service', 'run'], {
    stdio: ['ignore', out, err], 
    detached: true,
    env: ({ PATH: Yagna_Source }, { ELECTRON_ENABLE_LOGGING: true })
  }).unref();
  
  //Function to give time for Yagna to fully start
  setTimeout(function(){
    //Pulls Key from Yagna
    const Yagna_getAPPKEY = exec('yagna app-key list --json | jq -r .values[0]', {
      env: ({ PATH: Yagna_Source }, { ELECTRON_ENABLE_LOGGING: true })
    })
  
    Yagna_getAPPKEY.stdout.on('data', (data) => {
      console.log(`Key Get: ${data}`);
    });
    
    Yagna_getAPPKEY.stderr.on('data', (data) => {
      console.error(`Key Get: ${data}`);
    });

    Yagna_getAPPKEY.on('close', (code) => {
      console.log(`Key Get process exited with code ${code}`);
    });

    //Get public key
    const Yagna_getpublic = exec('yagna id show', {
      env: ({ PATH: Yagna_Source }, { ELECTRON_ENABLE_LOGGING: true }, { YAGNA_APPKEY: `$(yagna app-key list --json | jq -r .values[0])` })
    })

    Yagna_getpublic.stdout.on('data', (data) => {
      console.log(`Public Key: ${data}`);
    });

    function streamToString(stream, cb) {
      const chunks = [];
      stream.on('data', (chunk) => {
        chunks.push(chunk.toString());
      });
      stream.on('end', () => {
        cb(chunks.join(''));
      });
    };
    
    streamToString(Yagna_getpublic.stdout, (data) => {
      console.log(data);  // data is now my string variable
      console.log(`Public Address:`+data.slice(66, -3));
      const Public_Address = data.slice(66, -3);

      //Sends public address to renderer
      mainWindow.webContents.send('Public_Address_Send', Public_Address)
    });

    //yagna payment status
    const Yagna_Stat_check = exec('yagna payment status', {
      env: ({ PATH: Yagna_Source }, { ELECTRON_ENABLE_LOGGING: true }, { YAGNA_APPKEY: `$(yagna app-key list --json | jq -r .values[0])` })
    })
  
    Yagna_Stat_check.stdout.on('data', (data) => {
      console.log(`Status Check: ${data}`);
    });
    
    Yagna_Stat_check.stderr.on('data', (data) => {
      console.error(`Status Check error: ${data}`);
    });
    
    Yagna_Stat_check.on('close', (code) => {
      console.log(`Status Check process exited with code ${code}`);
    });

    //set yagna payment mode to sender
    const Yagna_pay_mode = exec('yagna payment init --sender', {
      env: ({ PATH: Yagna_Source }, { ELECTRON_ENABLE_LOGGING: true }, { YAGNA_APPKEY: `$(yagna app-key list --json | jq -r .values[0])` })
    })
  
    Yagna_pay_mode.stdout.on('data', (data) => {
      console.log(`Sender mode: ${data}`);
    });
    
    Yagna_pay_mode.stderr.on('data', (data) => {
      console.error(`Sender mode error: ${data}`);
    });
    
    Yagna_pay_mode.on('close', (code) => {
      console.log(`Sender mode process exited with code ${code}`);
    });

    // and load the index.html of the app.
    //mainWindow.loadFile(path.join(__dirname, 'index.html'));

    // Open the DevTools.
    mainWindow.webContents.openDevTools();

    splash.close();
    mainWindow.center();
    mainWindow.show();

  }, 5000);

};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

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