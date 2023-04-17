const ipcRenderer = require('electron').ipcRenderer;

const z_90 = 1.645;
const z_95 = 1.96;
const z_99 = 2.58;

async function init(){
    const result = await ipcRenderer.invoke('get-result', '')

    document.getElementById("result").innerText = result.knownWords + "/" + result.totalWords;
    document.getElementById("estimate").innerText = "Estimate of " + 
        Math.floor(1000 * (result.knownWords / result.totalWords)) + " words known";
}
init()



function restartButton(){
    ipcRenderer.send('reset', '')
    window.location.href = "../index.html"
}