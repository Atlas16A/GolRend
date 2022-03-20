const renderstart = document.getElementById('RenderStart');
const Public_Address = document.getElementById('Public_Address');
const GLM_Amount = document.getElementById('GLM_Amount')

const MINUS = document.getElementById('app/minimize');
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