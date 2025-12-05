// MENU LATERAL
const menu = document.getElementById('menu');
const hamburger = document.getElementById('hamburger');
const btnClose = document.getElementById('btn-close');

hamburger.addEventListener('click', e => {
    e.stopPropagation();
    menu.classList.add('open');
    hamburger.setAttribute('aria-expanded','true');
});

btnClose.addEventListener('click', e => {
    e.stopPropagation();
    menu.classList.remove('open');
    hamburger.setAttribute('aria-expanded','false');
});

// FECHAR MENU COM ESC
document.addEventListener('keydown', e => {
    if(e.key === "Escape") {
        menu.classList.remove('open');
        hamburger.setAttribute('aria-expanded','false');
    }
});

// NOTIFICAÇÕES
const bell = document.getElementById('notify');
const notifBox = document.getElementById('notif-box');

bell.addEventListener('click', e => {
    e.stopPropagation();
    notifBox.classList.toggle('open');
    let expanded = notifBox.classList.contains('open') ? 'true' : 'false';
    bell.setAttribute('aria-expanded', expanded);
});

// FECHAR NOTIFICAÇÕES AO CLICAR FORA
document.addEventListener('click', e => {
    if(notifBox.classList.contains('open')){
        notifBox.classList.remove('open');
        bell.setAttribute('aria-expanded','false');
    }
});
