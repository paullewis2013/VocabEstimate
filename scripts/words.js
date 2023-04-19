const { ipcRenderer } = require('electron')

var wordNum = 1;
var maxWords = localStorage.getItem('wordCount')
var language = localStorage.getItem('language')
var words

async function init(){
    document.getElementById("wordNum").innerHTML = wordNum + "/" + maxWords;

    var index = Math.floor(Math.random() * (1000) + 100);

    words = await ipcRenderer.invoke('get-words', '')
    document.getElementById("targetWord").innerHTML = words[wordNum - 1];
}
init()

var blockArrowKeys = false
var finished = false

//use left and right arrow keys instead of buttons
document.addEventListener("keydown", async function(event) {

    if(!blockArrowKeys & !finished){
        blockArrowKeys = true
        if (event.keyCode === 37) {
            // code to execute when left arrow key is pressed
            // console.log("Left arrow key pressed");
            await wordButton(false)
        }

        if (event.keyCode === 39) {
            // code to execute when right arrow key is pressed
            // console.log("right arrow key pressed");
            await wordButton(true)
        }
        blockArrowKeys = false
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
        var word = words[wordNum]
 
        document.getElementById("targetWord").innerHTML = word;
        incrementWordNum();
    }
}

function incrementWordNum(){

    wordNum++;
    document.getElementById("wordNum").innerHTML = wordNum + "/" + maxWords;
}