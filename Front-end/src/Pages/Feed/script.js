/* ------------------ BANCO LOCAL ------------------ */
let db = JSON.parse(localStorage.getItem("postsDB")) || {};

function saveDB() {
    localStorage.setItem("postsDB", JSON.stringify(db));
}

function initPost(id) {
    if (!db[id]) {
        db[id] = {
            likes: 0,
            favorited: false,
            comments: []
        };
    }
}

/* ------------------ FEED ------------------ */
document.querySelectorAll(".post-feed").forEach(post => {
    const id = post.dataset.id;
    initPost(id);

    const likeBtn = post.querySelector(".like-btn-feed");
    const likeCount = post.querySelector(".like-count-feed");
    const favBtn = post.querySelector(".fav-btn-feed");
    const commentBtn = post.querySelector(".comment-btn-feed");
    const commentInput = post.querySelector(".comment-input-feed");
    const sendBtn = post.querySelector(".send-comment-feed");
    const commentList = post.querySelector(".comment-list-feed");
    const commentCount = post.querySelector(".comment-count-feed");
    const linkBtn = post.querySelector(".link-btn-feed");
    const reportBtn = post.querySelector(".report-btn-feed");

    likeCount.textContent = db[id].likes;
    commentCount.textContent = db[id].comments.length;

    if (db[id].favorited) favBtn.style.color = "gold";

    function renderComments() {
        commentList.innerHTML = "";
        db[id].comments.forEach(text => {
            const div = document.createElement("div");
            div.className = "comment-item-feed";
            div.textContent = text;
            commentList.appendChild(div);
        });
    }

    renderComments();

    likeBtn.addEventListener("click", () => {
        likeBtn.classList.add("like-animate-feed");
        setTimeout(() => likeBtn.classList.remove("like-animate-feed"), 300);

        db[id].likes++;
        likeCount.textContent = db[id].likes;

        likeBtn.style.color = "red";
        saveDB();
    });

    favBtn.addEventListener("click", () => {
        db[id].favorited = !db[id].favorited;
        favBtn.style.color = db[id].favorited ? "gold" : "black";
        saveDB();
    });

    sendBtn.addEventListener("click", () => {
        const text = commentInput.value.trim();
        if (text === "") return;

        db[id].comments.push(text);
        commentInput.value = "";
        commentCount.textContent = db[id].comments.length;

        renderComments();
        saveDB();
    });

    linkBtn.addEventListener("click", () => {
        const fakeLink = `https://seusite.com/post/${id}`;
        navigator.clipboard.writeText(fakeLink).then(() => {
            alert("Link copiado:\n" + fakeLink);
        });
    });

    reportBtn.addEventListener("click", () => openReportModal(id));
});

/* ------------------ MODAL DE DENÚNCIA ------------------ */
const modal = document.querySelector(".modal-overlay-feed");

function openReportModal() {
    modal.classList.add("active");

    const textarea = modal.querySelector(".modal-textarea-feed");
    textarea.value = "";

    modal.querySelector(".cancel-feed").onclick = () => {
        modal.classList.remove("active");
    };

    modal.querySelector(".ok-feed").onclick = () => {
        if (textarea.value.trim() === "") return;

        alert("Problema enviado:\n\n" + textarea.value);
        modal.classList.remove("active");
    };
}

/* ------------------ LÓGICA COPIADA DO PRIMEIRO CÓDIGO (Sidebar, Notif e Busca) ------------------ */

document.addEventListener('DOMContentLoaded', function() {
    const menuToggleBtn = document.getElementById("menuToggleBtn");
    const sidebarMenu = document.getElementById("sidebarMenu");
    const sidebarOverlay = document.getElementById("sidebarOverlay");
    const btnCloseSidebar = document.getElementById("btn-close"); // btn-close agora é btn-close-sidebar no HTML novo
    
    const notifBox = document.getElementById("notif-box");
    const notifyBtn = document.getElementById("notifyBtn");
    const searchInput = document.getElementById("searchInput");
    const suggestionsBox = document.getElementById("suggestions");

    // --- Funções do Sidebar ---
    function openMenu() {
        sidebarMenu.classList.add("active");
        sidebarOverlay.style.display = "block";
        setTimeout(() => sidebarOverlay.classList.add("active"), 10);
        document.body.style.overflow = "hidden";
    }

    function closeMenu() {
        sidebarMenu.classList.remove("active");
        sidebarOverlay.classList.remove("active");
        document.body.style.overflow = "";
        setTimeout(() => {
            if (!sidebarMenu.classList.contains("active")) {
                sidebarOverlay.style.display = "none";
            }
        }, 300); 
    }

    if (menuToggleBtn) {
        menuToggleBtn.addEventListener("click", function () {
            if (sidebarMenu.classList.contains("active")) {
                closeMenu();
            } else {
                closeMenuNotification();
                openMenu();
            }
        });
    }

    if (sidebarOverlay) {
        sidebarOverlay.addEventListener("click", closeMenu);
    }
    
    if (btnCloseSidebar) {
        btnCloseSidebar.addEventListener("click", closeMenu);
    }

    document.querySelectorAll("#sidebarMenu .list-group-item").forEach((item) => {
        item.addEventListener("click", closeMenu);
    });
    
    // --- Funções de Notificações ---
    function closeMenuNotification() {
        notifBox.classList.remove("open");
    }

    if (notifyBtn) {
        notifyBtn.onclick = (e) => {
            e.stopPropagation();
            closeMenu();
            notifBox.classList.toggle("open");
        };
    }
    
    document.body.onclick = () => {
        closeMenuNotification();
        suggestionsBox.style.display = "none";
    };
    
    if (notifBox) {
        notifBox.onclick = (e) => e.stopPropagation();
    }
    
    // --- Funções de Pesquisa ---
    
    if (suggestionsBox) {
        suggestionsBox.onclick = (e) => e.stopPropagation();
    }
    
    if (searchInput) {
        searchInput.parentElement.onclick = (e) => e.stopPropagation();
    }
    
    // As funções de Geocodificação complexa (geocodeAndMoveMap, fetchSuggestions) foram
    // omitidas, pois dependem da biblioteca Leaflet (não presente neste arquivo JS) e
    // de um HTML diferente (mapa). Mantive apenas as funções simples de busca
    // adaptadas para o contexto do Feed/busca por rua.
    
    window.showSuggestions = function() {
        const input = searchInput.value;
        const box = suggestionsBox;

        if (input.length < 2) {
            box.innerHTML = "";
            box.style.display = "none";
            return;
        }

        // Simulação de lista de ruas, adaptada do script JS antigo
        const ruas = ["Rua Safira", "Rua Topázio", "Rua Esmeralda", "Rua Rubi"];

        const filtrado = ruas.filter(r =>
            r.toLowerCase().includes(input.toLowerCase())
        );

        box.innerHTML = filtrado
            .map(r => `<p onclick="selectStreet('${r}')">${r}</p>`)
            .join("");

        box.style.display = "block";
    }

    window.selectStreet = function(nomeRua) {
        searchInput.value = nomeRua;
        suggestionsBox.style.display = "none";
        alert("Indo para: " + nomeRua);
    }

    window.goToSearch = function() {
        const valor = searchInput.value;
        if (!valor) return alert("Digite um local para pesquisar.");
        alert("Buscando: " + valor);
    }

});