
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
    }
}
  