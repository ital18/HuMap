/* ----------------- menu / notify (mantive) ----------------- */
const menu = document.getElementById("menu");
const hamburger = document.getElementById("hamburger"); // mudado de .hamburger para id="hamburger" no HTML
const btnClose = document.getElementById("btn-close");
const notifyBtn = document.getElementById("notifyBtn");
const notifyBox = document.getElementById("notif-box"); // Adicionado para fechar corretamente

if(hamburger) hamburger.onclick = ()=> menu && menu.classList.add("open");
if(btnClose) btnClose.onclick = () => menu.classList.remove("open");

document.addEventListener("click", function(event) {
    const clickInsideMenu = menu.contains(event.target);
    const clickOnHamburger = hamburger.contains(event.target);

    if (!clickInsideMenu && !clickOnHamburger) {
        menu.classList.remove("open");
    }
});
if(notifyBtn) notifyBtn.onclick = (e) => {
            e.stopPropagation();
            notifyBox.classList.toggle("open");
        };

        // Fechar notificações ao clicar fora
        document.body.onclick = () => {
            if(notifyBox) notifyBox.classList.remove("open");
        };


function showSuggestions() {
            const input = document.getElementById("searchInput").value;
            const box = document.getElementById("suggestions");

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

        function selectStreet(nomeRua) {
            alert("Indo para " + nomeRua);
        }

        function goToSearch() {
            const valor = document.getElementById("searchInput").value;
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
