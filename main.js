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

        var startIndex = 0

        for(var i = 0; i < languageData.length; i++){
            if(languageData[i].split('\t')[0].length < 3){
                startIndex++;
            }else{
                //end the loop early when we stop seeing symbols
                break;
            }
        }

        languageData = languageData.slice(startIndex, languageData.length)
    })
})

ipcMain.on('known-word', (event, message) => {
    // console.log("known word: " + message)
    if(!knownWords.includes(message) && !unknownWords.includes(message)){
        knownWords.push(message)
    }else{
        console.log('duplicate word: ' + message)
    }
})

ipcMain.on('unknown-word', (event, message) => {
    // console.log("unknown word: " + message)
    if(!knownWords.includes(message) && !unknownWords.includes(message)){
        unknownWords.push(message)
    }else{
        console.log('duplicate word: ' + message)
    }
})

ipcMain.on('reset', (event, message) => {
    knownWords = []
    unknownWords = []
})
// Listen for messages from the renderer process
ipcMain.handle('get-word', (event, message) => {

    var word
    var index
        
    //get a random word, if it is already in the known or unknown words list, try again
    do{
        index = Math.floor(Math.random() * 1000)
        word = languageData[index]

        word = word.split('\t')[1]

    }while(knownWords.includes(word) || unknownWords.includes(word))

    // Send the word back to the renderer process
    return word
})
ipcMain.handle('get-result', (event, message) => {

    const z_90 = 1.645;
    const z_95 = 1.96;
    const z_99 = 2.58;

    var result = {
        knownWords: knownWords.length,
        unknownWords: unknownWords.length,
        sampleMean: 0,
        sampleStandardDeviation: 0,
        sampleSize: knownWords.length + unknownWords.length,
        variance: 0,
        vocabEstimate: 0,
        confidence90: 0,
        confidence95: 0,
        confidence99: 0
    }

    result.vocabEstimate = Math.floor(1000 * (knownWords.length / (knownWords.length + unknownWords.length)))
    result.sampleMean = result.knownWords / result.sampleSize
    
    sumSquaredDeviations = knownWords.length * Math.pow((1 - result.sampleMean), 2) + unknownWords.length * Math.pow((0 - result.sampleMean), 2)
    
    result.variance = sumSquaredDeviations / (result.sampleSize - 1)
    result.sampleStandardDeviation = Math.sqrt(result.variance)

    result.confidence90 = z_90 * result.sampleStandardDeviation / Math.sqrt(result.sampleSize)
    result.confidence95 = z_95 * result.sampleStandardDeviation / Math.sqrt(result.sampleSize)
    result.confidence99 = z_99 * result.sampleStandardDeviation / Math.sqrt(result.sampleSize)

    return result
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