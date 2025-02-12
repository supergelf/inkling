"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("electron", {
  readFile: (filePath) => electron.ipcRenderer.invoke("read-file", filePath),
  writeFile: (filePath, content) => electron.ipcRenderer.invoke("write-file", filePath, content),
  ipcRenderer: {
    on: (...args) => electron.ipcRenderer.on(...args),
    off: (...args) => electron.ipcRenderer.off(...args),
    send: (...args) => electron.ipcRenderer.send(...args),
    invoke: (...args) => electron.ipcRenderer.invoke(...args)
  }
});
