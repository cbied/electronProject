const { app, BrowserWindow } = require('electron'),
    path = require('path'),
    url = require('url')



function createWindow() {
    // create browser window
    let win = new BrowserWindow({
        webPreferences: {
        nodeIntegration: true,
        width: 800, 
        height: 600, 
        icon:__dirname+'/images/react-icons.htm'
    }
    })
    // Load index.html
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));

    // Open devtools
    win.webContents.openDevTools();

    win.on('closed', () => {
        win = null;
    });
}

// Run create window function
app.on('ready', createWindow)

// Quit when all windows are closed
app.on('window-all-closed', () => {
    if(process.platform !== 'darwin') {
        app.quit();
    }
})

