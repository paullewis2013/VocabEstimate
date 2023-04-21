// main.js

// Modules to control application life and create native browser window
const { app, BrowserWindow } = require('electron')
const fs = require('fs')
const path = require('path')
const { ipcMain } = require('electron')

var languageData = []
var knownWords = [[],[],[],[],[]]
var unknownWords = [[],[],[],[],[]]
var brackets = 5
var bracketSizes = []
var sampleSize = 50
var wordNum = 1

// Listen for messages from the renderer process
ipcMain.on('set-language', (event, message) => {
    console.log("language set to " + message) 

    const filePath = path.join(__dirname, 'data/' + message + '.txt')
    
    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            console.error(err)
            return
        }
        
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

        //clean the data
        var removeNumerals = true
        var removeCapitalFirstLetters = true // hopefully this will remove names
        var removeSpaces = true
        var removeQuotes = true

        cleanedData = []

        for(var i = 0; i < languageData.length; i++){
            var words = languageData[i].split('\t')
            var word
            if(words.length > 1){
                word = words[1]
            }else{
                continue;
            }   
            if(removeNumerals){
                if(/\d/.test(word)){
                    // console.log("ignoring " + word + " because it contains a numeral")
                    continue;
                }
            }

            if(removeQuotes){
                if(word.includes('\'') || word.includes("\"")){
                    // console.log("ignoring " + word + " because it contains a quote")
                    continue;
                }
            }

            if(removeCapitalFirstLetters){
                if(word[0] == word[0]?.toUpperCase()){
                    // console.log("ignoring " + word + " because it starts with a capital letter")
                    continue;
                }
            }

            if(removeSpaces){
                if(word.includes(' ')){
                    // console.log("ignoring " + word + " because it contains a space")
                    continue;
                }
            }

            cleanedData.push(languageData[i])
        }
        // console.log(cleanedData.length)
        languageData = cleanedData
    })
})
ipcMain.on('set-sample-size', (event, message) => {
    sampleSize = message
    // console.log(sampleSize)
})
ipcMain.on('known-word', (event, message) => {
    // console.log("known word: " + message)
    let currentBracket = Math.floor((wordNum - 1)/(sampleSize/brackets))

    if(!knownWords[currentBracket].includes(message) && !unknownWords[currentBracket].includes(message)){
        knownWords[currentBracket].push(message)
    }else{
        console.log('duplicate word: ' + message)
    }
    wordNum++;
})
ipcMain.on('unknown-word', (event, message) => {
    // console.log("unknown word: " + message)
    let currentBracket = Math.floor((wordNum - 1)/(sampleSize/brackets))

    if(!knownWords[currentBracket].includes(message) && !unknownWords[currentBracket].includes(message)){
        unknownWords[currentBracket].push(message)
    }else{
        console.log('duplicate word: ' + message)
    }
    wordNum++;
})
ipcMain.on('reset', (event, message) => {
    knownWords = [[],[],[],[],[]]
    unknownWords = [[],[],[],[],[]]
    wordNum = 1
})
ipcMain.handle('get-words', (event, message) => {

    var words = []
    var word

    var bracketStart = 0
    var bracketSize = 500

    var index
    
    for(let i = 0; i < sampleSize; i++){

        //get a random word, if it is already in words list, try again
        do{
            var index = Math.floor((Math.random() * bracketSize) + bracketStart)
            // console.log(index)
            word = languageData[index]

            word = word.split('\t')[1]

        }while(words.includes(word))

        words.push(word)

        if (Math.floor(i % (sampleSize/brackets)) == Math.floor(sampleSize / brackets) - 1) {
            bracketStart += bracketSize
            bracketSizes.push(bracketSize)
            bracketSize *= 2.5
        }
    }

    // console.log(bracketSizes)

    // Send the word back to the renderer process
    return words
})
ipcMain.handle('get-result', (event, message) => {

    const z_90 = 1.645;
    const z_95 = 1.96;
    const z_99 = 2.58;

    var sumKnown = 0
    for(let i = 0; i < knownWords.length; i++){
        sumKnown += knownWords[i].length
    }

    var sumUnknown = 0
    for(let i = 0; i < unknownWords.length; i++){
        sumUnknown += unknownWords[i].length
    }

    var result = {
        knownWords: knownWords,
        unknownWords: unknownWords,
        sumKnown: sumKnown,
        sumUnknown: sumUnknown,
        sampleMeans: [],
        sampleStandardDeviations: [],
        sampleSize: sampleSize - 0,
        bracketSizes: bracketSizes,
        variances: [],
        vocabEstimate: 0,
        confidences90: [],
        sum90: 0,
        confidences95: [],
        sum95: 0,
        confidences99: [],
        sum99: 0,
    }
    
    for(let i = 0; i < knownWords.length; i++){
        result.sampleMeans.push(knownWords[i].length / (knownWords[i].length + unknownWords[i].length))
    }

    result.vocabEstimate = 0
    for(let i = 0; i < result.sampleMeans.length; i++){
        result.vocabEstimate += result.sampleMeans[i] * bracketSizes[i]
    }
    
    sumsSquaredDeviations = []
    for(let i = 0; i < result.knownWords.length; i++){
        sumsSquaredDeviations.push(knownWords[i].length * Math.pow((1 - result.sampleMeans[i]), 2) + unknownWords[i].length * Math.pow((0 - result.sampleMeans[i]), 2))
    }

    for(let i = 0; i < result.knownWords.length; i++){
        result.variances.push(sumsSquaredDeviations[i] / (result.knownWords[i].length + result.unknownWords[i].length - 1))
    }

    for(let i = 0; i < result.knownWords.length; i++){
        result.sampleStandardDeviations.push(Math.sqrt(result.variances[i]))
    }
    
    for(let i = 0; i < result.knownWords.length; i++){
        result.confidences90.push(z_90 * result.sampleStandardDeviations[i] / Math.sqrt(result.knownWords[i].length + result.unknownWords[i].length))
        result.sum90 += result.confidences90[i] * bracketSizes[i]
    }

    for(let i = 0; i < result.knownWords.length; i++){
        result.confidences95.push(z_95 * result.sampleStandardDeviations[i] / Math.sqrt(result.knownWords[i].length + result.unknownWords[i].length))
        result.sum95 += result.confidences95[i] * bracketSizes[i]
    }

    for(let i = 0; i < result.knownWords.length; i++){
        result.confidences99.push(z_99 * result.sampleStandardDeviations[i] / Math.sqrt(result.knownWords[i].length + result.unknownWords[i].length))
        result.sum99 += result.confidences99[i] * bracketSizes[i]
    }

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