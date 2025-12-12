// O CÓDIGO DE MENU, HAMBURGUER E NOTIFICAÇÃO FOI REMOVIDO PARA USAR A LÓGICA CENTRALIZADA EM base.html

/* ----------------- Search functions (Mocked from base.html) ----------------- */
// Manter as funções de busca globais para sobrescrever as do base.html com mocks específicos.
window.showSuggestions = function() {
    const input = document.getElementById("searchInput")?.value;
    const box = document.getElementById("suggestions");

    if (!box || !input) return;

    if (input.length < 2) {
        box.innerHTML = "";
        box.style.display = "none";
        return;
    }

    const ruas = ["Rua Safira", "Rua Topázio", "Rua Esmeralda", "Rua Rubi"];

    const filtrado = ruas.filter(r => r.toLowerCase().includes(input.toLowerCase()));

    box.innerHTML = filtrado
        .map(r => `<p onclick="selectStreet('${r}')">${r}</p>`)
        .join("");

    box.style.display = "block";
}

window.selectStreet = function(nomeRua) {
    const searchInput = document.getElementById("searchInput");
    const suggestionsBox = document.getElementById("suggestions");
    if (searchInput && suggestionsBox) {
        searchInput.value = nomeRua;
        suggestionsBox.style.display = "none";
        alert("Indo para " + nomeRua);
    }
}

window.goToSearch = function() {
    const valor = document.getElementById("searchInput")?.value;
    if (!valor) return alert("Digite um destino.");
    alert("Buscando: " + valor);
}


/* ----------------- Carrossel logic (1 item por vez, setas obrigatórias) ----------------- */
/* Para cada wrapper-carrosel-suport: */
document.querySelectorAll('.wrapper-carrosel-suport').forEach(wrapper=>{
    const carousel = wrapper.querySelector('.carrosel-suport');
    const items = Array.from(carousel.children);
    let index = 0;

    // inicializa: marca o primeiro active
    items.forEach((it,i)=> it.classList.toggle('active', i===index));
    // scroll inicial
    const update = (instant=false)=>{
        const left = index * carousel.clientWidth;
        if(instant) carousel.scrollLeft = left;
        else carousel.scrollTo({ left, behavior: 'smooth' });
        items.forEach((it,i)=> it.classList.toggle('active', i===index));
    };
    update(true);

    // setas (existem 2 botões por wrapper)
    const btnPrev = wrapper.querySelector('.seta-esquerda-carrosel-suport');
    const btnNext = wrapper.querySelector('.seta-direita-carrosel-suport');

    if(btnNext){
        btnNext.addEventListener('click', (e)=>{
            e.stopPropagation();
            if(index < items.length - 1) index++;
            update();
        });
    }
    if(btnPrev){
        btnPrev.addEventListener('click', (e)=>{
            e.stopPropagation();
            if(index > 0) index--;
            update();
        });
    }
    

    // prevenir scroll por roda do mouse e touch arrastar acidental
    wrapper.addEventListener('wheel', e=> e.preventDefault(), {passive:false});
    carousel.addEventListener('touchstart', e=> e.preventDefault(), {passive:false});

    /* ZOOM on hover, but NOT when mouse is over arrows:
       - adicionamos classe .zoom ao wrapper quando entra no carousel
       - quando mouse entra nas setas, removemos zoom
    */
    const onEnterCarousel = ()=> wrapper.classList.add('zoom');
    const onLeaveCarousel = ()=> wrapper.classList.remove('zoom');

    carousel.addEventListener('mouseenter', onEnterCarousel);
    carousel.addEventListener('mouseleave', onLeaveCarousel);

    if(btnNext){
      btnNext.addEventListener('mouseenter', ()=> wrapper.classList.remove('zoom'));
      btnNext.addEventListener('mouseleave', ()=> { /* se ainda sobre carousel, reativa */ 
          // Correção de lógica de reativação de zoom
          setTimeout(()=>{ 
              const rect = carousel.getBoundingClientRect();
              const x = event.clientX;
              const y = event.clientY;
              if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
                  wrapper.classList.add('zoom');
              }
          }, 10);
      });
    }
    if(btnPrev){
      btnPrev.addEventListener('mouseenter', ()=> wrapper.classList.remove('zoom'));
      btnPrev.addEventListener('mouseleave', ()=> {
          // Correção de lógica de reativação de zoom
          setTimeout(()=>{ 
              const rect = carousel.getBoundingClientRect();
              const x = event.clientX;
              const y = event.clientY;
              if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
                  wrapper.classList.add('zoom');
              }
          }, 10);
      });
    }

}); // fim each wrapper