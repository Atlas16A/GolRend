const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  handlePublic_Address: (callback) => ipcRenderer.on('Public_Address_Send', callback)
});

//contextBridge.exposeInMainWorld('electronAPI', {
  //handleBalance: (callback) => ipcRenderer.on('Balance_Send', callback)
//});