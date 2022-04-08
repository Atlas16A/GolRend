const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  handlePublic_Address: (callback) => ipcRenderer.on('Public_Address_Send', callback),
  handleBalance: (callback) => ipcRenderer.on('Total_Amount_Send', callback),
  close: () => ipcRenderer.send('close_app'),
  minimize: () => ipcRenderer.send('minimize_app'),
  render: () => ipcRenderer.send('render_start'),
  blendinput: () => ipcRenderer.send('blend_input'),
  blendoutput: () => ipcRenderer.send('blend_output'),
  menu_open: () => ipcRenderer.send('menu_open'),
  menu_close: () => ipcRenderer.send('menu_close'),
  //menu_size: (size) => ipcRenderer.on('menu_size', size)
});
