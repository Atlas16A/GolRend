const renderstart = document.getElementById('RenderStart');
const blendinput = document.getElementById('blendinput')
const blendoutput = document.getElementById('blendoutput')
const Public_Address = document.getElementById('Public_Address');
const GLM_Amount = document.getElementById('GLM_Amount')

const MINUS = document.getElementById('app_minimize');
const CLOSE = document.getElementById('app/close');

window.electronAPI.handlePublic_Address((event, address) => {
    Public_Address.innerText = address
});

window.electronAPI.handleBalance((event, balance) => {
    GLM_Amount.innerText = balance
});

MINUS.addEventListener("click", () => {
    window.electronAPI.minimize('minimize_app')
});
CLOSE.addEventListener("click", () => {
    window.electronAPI.close('close_app')
});
renderstart.addEventListener("click", () => {
    //window.electronAPI.render('render_start')
    //swap button text with div with id 'RenderStart'
    renderstart.innerHTML = '<div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>'
});
blendinput.addEventListener("click", () => {
    window.electronAPI.blendinput('blend_input')
});
blendoutput.addEventListener("click", () => {
    window.electronAPI.blendoutput('blend_output')
});

const MENU = document.getElementById('menu');

MENU.addEventListener("click", () => {
    window.electronAPI.menu_open('menu_open')
});

//send menu_close when click event happens anywhere on the window except the menu element 
document.addEventListener('click', (event) => {
    if (event.target.id !== 'menu') {
        window.electronAPI.menu_close('menu_close')
    }
});

