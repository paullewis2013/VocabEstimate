const ipcRenderer = require('electron').ipcRenderer;

async function init(){
    const result = await ipcRenderer.invoke('get-result', '')

    document.getElementById("result").innerHTML = result;
}
init()

function restartButton(){
    ipcRenderer.send('reset', '')
    window.location.href = "index.html"
}