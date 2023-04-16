const { ipcRenderer } = require('electron')

var wordNum = 1;
var maxWords = localStorage.getItem('wordCount')
var language = localStorage.getItem('language')

async function init(){
    document.getElementById("wordNum").innerHTML = wordNum + "/" + maxWords;

    var index = Math.floor(Math.random() * (1000) + 100);

    const word = await ipcRenderer.invoke('get-word', index)
    document.getElementById("targetWord").innerHTML = word;
}
init()

var blockArrowKeys = false
var finished = false

//use left and right arrow keys instead of buttons
document.addEventListener("keydown", async function(event) {
    
    console.log('blockArrowKeys' + blockArrowKeys)

    if(!blockArrowKeys & !finished){
        blockArrowKeys = true
        if (event.keyCode === 37) {
            // code to execute when left arrow key is pressed
            console.log("Left arrow key pressed");
            await wordButton(false)
        }

        if (event.keyCode === 39) {
            // code to execute when left arrow key is pressed
            console.log("right arrow key pressed");
            await wordButton(true)
        }
        blockArrowKeys = false
    }else{
        console.log("blocked")
    }
});

async function wordButton(isKnown){

    var prevWord = document.getElementById("targetWord").innerHTML

    if(isKnown){
        //TODO add to known words
        ipcRenderer.send('known-word', prevWord)
    }else{
        //TODO add to unknown words
        ipcRenderer.send('unknown-word', prevWord)
    }

    if(wordNum == maxWords){
        document.getElementById("success-button").disabled = true;
        document.getElementById("fail-button").disabled = true;
        document.getElementById("continueButton").disabled = false;
        finished = true;
    }

    if(wordNum < maxWords){

        //load next word
        const word = await ipcRenderer.invoke('get-word', '')
 
        document.getElementById("targetWord").innerHTML = word;
        incrementWordNum();
    }
}

function incrementWordNum(){

    wordNum++;
    document.getElementById("wordNum").innerHTML = wordNum + "/" + maxWords;
}