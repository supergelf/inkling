import { app, BrowserWindow } from "electron";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";
import * as fs from "fs";
const require2 = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const { ipcMain } = require2("electron");
process.env.APP_ROOT = path.join(__dirname, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
let win;
function createWindow() {
  win = new BrowserWindow({
    frame: false,
    // Removes the standard title bar
    titleBarStyle: "hidden",
    // Hides the default title bar
    resizable: true,
    width: 1300,
    height: 900,
    icon: path.join(process.env.VITE_PUBLIC, "/icons/nosy_transparent.png"),
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
      // Load the preload script
      nodeIntegration: false,
      // Keep this false for security
      contextIsolation: true
      // Enable context isolation
    }
  });
  win.on("maximize", () => {
    win == null ? void 0 : win.webContents.send("window-maximized");
  });
  win.on("unmaximize", () => {
    win == null ? void 0 : win.webContents.send("window-unmaximized");
  });
  win.webContents.on("did-finish-load", () => {
    win == null ? void 0 : win.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  });
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
}
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
app.whenReady().then(createWindow);
ipcMain.on("minimize-window", (event) => {
  const window = BrowserWindow.getFocusedWindow();
  if (window) window.minimize();
});
ipcMain.on("maximize-window", (event) => {
  const window = BrowserWindow.getFocusedWindow();
  if (window) {
    window.maximize();
    window == null ? void 0 : window.webContents.send("window-maximized");
  }
});
ipcMain.on("unmaximize-window", (event) => {
  const window = BrowserWindow.getFocusedWindow();
  if (window) {
    window.unmaximize();
    window == null ? void 0 : window.webContents.send("window-unmaximized");
  }
});
ipcMain.on("close-window", (event) => {
  const window = BrowserWindow.getFocusedWindow();
  if (window) window.close();
});
ipcMain.handle("read-file", async (event, filePath) => {
  return fs.promises.readFile(filePath, "utf-8");
});
ipcMain.handle("write-file", async (event, filePath, content) => {
  return fs.promises.writeFile(filePath, content);
});
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
