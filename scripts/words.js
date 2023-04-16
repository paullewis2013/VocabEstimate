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

//use left and right arrow keys instead of buttons
document.addEventListener("keydown", function(event) {
    if (event.keyCode === 37) {
        // code to execute when left arrow key is pressed
        console.log("Left arrow key pressed");
        wordButton(false)
    }

    if (event.keyCode === 39) {
        // code to execute when left arrow key is pressed
        console.log("right arrow key pressed");
        wordButton(true)
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
    }

    if(wordNum < maxWords){
        
        //TODO decide bracket range of next word
        var index = Math.floor(Math.random() * (1000) + 100);

        //load next word
        const word = await ipcRenderer.invoke('get-word', index)
 
        document.getElementById("targetWord").innerHTML = word;
        incrementWordNum();
    }
}

function incrementWordNum(){

    console.log("here")

    wordNum++;
    document.getElementById("wordNum").innerHTML = wordNum + "/" + maxWords;
}