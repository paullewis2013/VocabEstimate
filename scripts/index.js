const { ipcRenderer } = require('electron')

// set language to English initially
ipcRenderer.send('set-language', getSelectedLanguage())

function beginButton(){

    var wordCount = getSelectedWordCount()
    var language = getSelectedLanguage()

    //save to local storage to access in other pages
    localStorage.setItem('wordCount', wordCount)
    localStorage.setItem('language', language)

    ipcRenderer.send('set-sample-size', wordCount)
    location.href = "html/words.html";
}

// called whenever dropdown changes
function changeGreeting() {

    var heading = document.querySelector('h1');

    var dropdown = document.querySelector('select');
    var selectedOption = dropdown.options[dropdown.selectedIndex];
    var selectedText = selectedOption.text;
    
    if (selectedText === 'English') {
        heading.innerText = 'Hello!';
    } else if (selectedText === 'Spanish') {
        heading.innerText = '¡Hola!';
    } else if (selectedText === 'French') {
        heading.innerText = 'Bonjour!';
    } else if (selectedText === 'Portuguese') {
        heading.innerText = 'Olá!';
    }
}

function changeLanguage(){

    changeGreeting()

    //load correct word set
    ipcRenderer.send('set-language', getSelectedLanguage())
}
  
function getSelectedWordCount(){

    //get the value of the radio button
    var radio = document.querySelector('input[name="wordCount"]:checked');

    return radio.value
}

function getSelectedLanguage(){

    //get the value of the selected option
    var dropdown = document.querySelector('select');
    var selectedOption = dropdown.options[dropdown.selectedIndex];
    return selectedOption.text;
}