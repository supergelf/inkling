import { app, BrowserWindow } from "electron";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";
import * as fs from "fs";

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const { ipcMain } = require("electron");

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, "..");

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;

let win: BrowserWindow | null;

function createWindow() {
  win = new BrowserWindow({
    frame: false, // Removes the standard title bar
    titleBarStyle: "hidden", // Hides the default title bar
    resizable: true,
    width: 1300,
    height: 900,
    icon: path.join(process.env.VITE_PUBLIC, "/icons/nosy_transparent.png"),
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"), // Load the preload script
      nodeIntegration: false, // Keep this false for security
      contextIsolation: true, // Enable context isolation
    },
  });

  // Listen for maximize and unmaximize events
  win.on("maximize", () => {
    win?.webContents.send("window-maximized");
  });

  win.on("unmaximize", () => {
    win?.webContents.send("window-unmaximized");
  });

  // Test active push message to Renderer-process.
  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
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
    window?.webContents.send("window-maximized");
  }
});

ipcMain.on("unmaximize-window", (event) => {
  const window = BrowserWindow.getFocusedWindow();
  if (window) {
    window.unmaximize();
    window?.webContents.send("window-unmaximized");
  }
});

ipcMain.on("close-window", (event) => {
  const window = BrowserWindow.getFocusedWindow();
  if (window) window.close();
});

// Handle file read requests
ipcMain.handle("read-file", async (event, filePath: string) => {
  return fs.promises.readFile(filePath, "utf-8");
});

// Handle file write requests
ipcMain.handle("write-file", async (event, filePath: string, content: string) => {
  return fs.promises.writeFile(filePath, content);
});
