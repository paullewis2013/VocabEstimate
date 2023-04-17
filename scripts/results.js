const ipcRenderer = require('electron').ipcRenderer;

var result

async function init(){
    result = await ipcRenderer.invoke('get-result', '')
    console.log(result)

    document.getElementById("result").innerText = result.knownWords + "/" + result.sampleSize;
    document.getElementById("estimate").innerText = "Estimate of " + result.vocabEstimate + 
        " words known +-" +  result.vocabEstimate * result.confidence95 + " with " + confidence + "% confidence";
}
init()

function restartButton(){
    ipcRenderer.send('reset', '')
    window.location.href = "../index.html"
}

var confidence = 0.95

function changeConfidence(){
    var confidence = document.getElementById("confidence-interval").value
    console.log(confidence)

    var confidencePercent;

    switch(confidence){
        case "90":
            confidencePercent = result.confidence90
            break;
        case "95":
            confidencePercent = result.confidence95
            break;
        case "99":
            confidencePercent = result.confidence99
            break;
    }

    document.getElementById("estimate").innerText = "Estimate of " + result.vocabEstimate + 
        " words known +-" +  result.vocabEstimate * confidencePercent + " with " + confidence + "% confidence";
}