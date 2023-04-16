// main.js

// Modules to control application life and create native browser window
const { app, BrowserWindow } = require('electron')
const fs = require('fs')
const path = require('path')
const { ipcMain } = require('electron')

var languageData = []
var knownWords = []
var unknownWords = []

// Listen for messages from the renderer process
ipcMain.on('set-language', (event, message) => {
    console.log("language set to " + message) 

    const filePath = path.join(__dirname, 'data/' + message + '.txt')
    
    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            console.error(err)
            return
        }
        
        // Do something with the file data here
        languageData = data.split('\n')
    })
})

ipcMain.on('known-word', (event, message) => {
    console.log("known word: " + message)
    knownWords.push(message)
})

ipcMain.on('unknown-word', (event, message) => {
    console.log("unknown word: " + message)
    unknownWords.push(message)
})

ipcMain.on('reset', (event, message) => {
    knownWords = []
    unknownWords = []
})
// Listen for messages from the renderer process
ipcMain.handle('get-word', (event, message) => {

    // Get a random word from the language data
    var word = languageData[message]
    // console.log(word)

    word = word.split('\t')[1]
    // console.log(word)

    // Send the word back to the renderer process
    return word
})
ipcMain.handle('get-result', (event, message) => {
    return "Result: " + knownWords.length + "/" + (unknownWords.length + knownWords.length)
})

const createWindow = () => {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 1200,
        height: 900,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
        },
    })

    // and load the index.html of the app.
    mainWindow.loadFile('index.html')
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

// Quit when all windows are closed
app.on('window-all-closed', () => {
    app.quit()
})