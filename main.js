const electron = require('electron'),
    { app, BrowserWindow, Menu, ipcMain } = require('electron'),
    path = require('path'),
    url = require('url')

// SET ENV
process.env.NODE_ENV = 'production'

let mainWindow
let addWindow

function createWindow() {
    // create browser window
    mainWindow = new BrowserWindow({
        icon:__dirname+'/images/react-icons.htm',
        webPreferences: {
        nodeIntegration: true,
    }
    })
    // Load index.html
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'mainWindow.html'),
        protocol: 'file:',
        slashes: true
    }));

    // Build menu template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    // Insert menu
    Menu.setApplicationMenu(mainMenu);

    mainWindow.on('closed', () => {
        app.quit()
    });
}

// Run create window function
app.on('ready', createWindow)

// handle create add window
function createAddWindow() {
    addWindow = new BrowserWindow({
        width: 300, 
        height: 200, 
        title: 'Add Shopping List Item',
        webPreferences: {
            nodeIntegration: true,
        }
    })
    // Load index.html
    addWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'addWindow.html'),
        protocol: 'file:',
        slashes: true
    }));
    // Garbage collection handle
    addWindow.on('close', () => {
        addWindow = null;
    })
}



// Catch item:add
ipcMain.on('item:add', function(e,item) {
    mainWindow.webContents.send('item:add', item);
    addWindow.close();
})



    // Create menu template
    const mainMenuTemplate = [
        {
            label: "File", 
            submenu: [
                {
                    label: 'Add Item',
                    accelerator: process.platform == 'darwin' ? 'Command+Z' : 'Ctrl+Z',
                    click(){
                        createAddWindow();
                    }
                },
                {
                    label: "Clear Items",
                    click(){
                        mainWindow.webContents.send('item:clear')
                    }
                },
                {
                    label: "Quit",
                    accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
                    click(){
                        app.quit()
                    }
                }
            ]
        }
];

// If mac, add empty object to menu
if(process.platform == 'darwin') {
    mainMenuTemplate.unshift({});
} 

// add dev tools if not in production
if(process.env.NODE_ENV !== 'production') {
    mainMenuTemplate.push({
        label: 'Developer Tools',
        submenu: [
            {
                label: 'Toggle DevTools',
                accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools();
                }  
            },
            {
                role: 'reload'
            }
            
        ]
    })
}