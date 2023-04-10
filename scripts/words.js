var wordNum = 1;
var maxWords = localStorage.getItem('wordCount')
var language = localStorage.getItem('language')

function init(){
    document.getElementById("wordNum").innerHTML = wordNum + "/" + maxWords;

    document.getElementById("targetWord").innerHTML = generateRandomString(5);
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

function wordButton(isKnown){

    if(isKnown){
        //TODO add to known words
    }else{
        //TODO add to unknown words
    }

    if(wordNum == maxWords){
        document.getElementById("success-button").disabled = true;
        document.getElementById("fail-button").disabled = true;
        document.getElementById("continueButton").disabled = false;
    }

    if(wordNum < maxWords){
        
        //TODO decide bracket range of next word

        //TODO load next word


        document.getElementById("targetWord").innerHTML = generateRandomString(5);

        incrementWordNum();
    }
}

function incrementWordNum(){

    console.log("here")

    wordNum++;
    document.getElementById("wordNum").innerHTML = wordNum + "/" + maxWords;
}

function generateRandomString() {
    let randomString = "";
    const alphabet = "abcdefghijklmnopqrstuvwxyz";
    for (let i = 0; i < 6; i++) {
        const randomIndex = Math.floor(Math.random() * alphabet.length);
        randomString += alphabet[randomIndex];
    }
    return randomString;
}