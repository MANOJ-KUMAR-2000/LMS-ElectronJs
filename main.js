const { app, BrowserWindow } = require("electron");
const server = require("./app.js");

let mainWindow;

const gotTheLock = app.requestSingleInstanceLock()

function sleep(ms) { return new Promise((resolve) => setTimeout(resolve, ms)); }

async function createWindow() {
    await sleep(1000);
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 720,
        icon: "./icon.ico",
        webPreferences: {
            nodeIntegration: true,
        },
        minWidth: 1280,
        minHeight: 720,
        autoHideMenuBar: true,
        center: true,
    });

    mainWindow.loadURL("http://localhost:52383/authentication/login");
    mainWindow.on("closed", function() {
        mainWindow = null;
    });
}


if (!gotTheLock) {
    app.quit()
} else {
    app.on('second-instance', (event, commandLine, workingDirectory) => {
        if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore()
            mainWindow.focus()
        }
    })

    app.on("ready", createWindow);
}
app.on("resize", function(e, x, y) {
    mainWindow.setSize(x, y);
});

app.on("window-all-closed", function() {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", function() {
    if (mainWindow === null) {
        createWindow();
    }
});