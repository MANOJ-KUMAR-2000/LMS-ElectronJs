const { app, BrowserWindow } = require("electron");
const server = require("./app.js");

let mainWindow;

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function createWindow() {
    await sleep(1000);
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 720,
        icon: "./icon.ico",
        webPreferences: {
            nodeIntegration: true,
        },
    });

    mainWindow.loadURL("http://localhost:52383/authentication/login");
    mainWindow.on("closed", function() {
        mainWindow = null;
    });
}

app.on("ready", createWindow);

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