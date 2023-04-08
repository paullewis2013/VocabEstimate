
wordNum = 1;
maxWords = 10;

function wordButton(isKnown){

    if(isKnown){
        //TODO add to known words
    }else{
        //TODO add to unknown words
    }

    //TODO decide bracket range of next word

    //TODO load next word
    document.getElementById("targetWord").innerHTML = generateRandomString(5);

    incrementWordNum();

    if(wordNum > maxWords){
        //TODO load next screen with results
        document.getElementById("continueButton").disabled = false;
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