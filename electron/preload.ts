import { ipcRenderer, contextBridge } from "electron";

contextBridge.exposeInMainWorld("electron", {
  readFile: (filePath: string) => ipcRenderer.invoke("read-file", filePath),
  writeFile: (filePath: string, content: string) => ipcRenderer.invoke("write-file", filePath, content),
  ipcRenderer: {
    on: (...args: Parameters<typeof ipcRenderer.on>) => ipcRenderer.on(...args),
    off: (...args: Parameters<typeof ipcRenderer.off>) => ipcRenderer.off(...args),
    send: (...args: Parameters<typeof ipcRenderer.send>) => ipcRenderer.send(...args),
    invoke: (...args: Parameters<typeof ipcRenderer.invoke>) => ipcRenderer.invoke(...args),
  },
});
