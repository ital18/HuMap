document.addEventListener("DOMContentLoaded", () => {
    // 1. LÓGICA DE ABAS (TABS)
    const tabButtons = document.querySelectorAll('.tab-btn');
    const pages = document.querySelectorAll('.posts-page');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove ativo de todos
            tabButtons.forEach(b => b.classList.remove('active'));
            pages.forEach(p => p.classList.remove('active'));

            // Ativa o atual
            btn.classList.add('active');
            const targetId = btn.dataset.target;
            const targetEl = document.getElementById(targetId);
            if (targetEl) targetEl.classList.add('active');
        });
    });

    // 2. BUSCAR MINHAS DENÚNCIAS DA API
    loadUserPosts();

    // 3. BOTÕES DE AÇÃO (EDITAR E CHAT)
    setupProfileActions();
});

async function loadUserPosts() {
    const container = document.getElementById("lista-minhas-denuncias");
    const contador = document.getElementById("contador-denuncias");
    
    // Pega o nome e email do usuário renderizados pelo Django no HTML
    const userNameInput = document.getElementById("user-name-logged");
    const userEmailInput = document.getElementById("user-email-logged");

    // Prevenção de erro caso os inputs não existam
    if (!userNameInput || !userEmailInput) return;

    const userName = userNameInput.value.trim();
    const userEmail = userEmailInput.value.trim();

    try {
        const response = await fetch('/api/denuncias/');
        
        if (!response.ok) throw new Error("Falha ao carregar API");
        
        const data = await response.json();

        // Filtragem no Front-end:
        const myPosts = data.filter(post => {
            if (!post.usuario_nome) return false;
            return post.usuario_nome === userName || userEmail.includes(post.usuario_nome);
        });

        // Atualiza o contador no topo do perfil
        if (contador) contador.innerHTML = `<strong>${myPosts.length}</strong> Denúncias realizadas`;

        if (myPosts.length === 0) {
            if (container) container.innerHTML = '<p class="placeholder">Você ainda não registrou nenhuma denúncia no mapa.</p>';
            return;
        }

        // Limpa loading e Renderiza os cards
        if (container) {
            container.innerHTML = "";
            myPosts.forEach(post => {
                const card = createPostCard(post, userName);
                container.appendChild(card);
            });
        }

    } catch (error) {
        console.error("Erro ao carregar posts:", error);
        if (container) container.innerHTML = '<p class="placeholder" style="color:#d9534f">Não foi possível carregar suas denúncias no momento.</p>';
        if (contador) contador.textContent = "Erro ao carregar dados";
    }
}

function createPostCard(data, userName) {
    const card = document.createElement('div');
    card.className = 'post-card-perfil';

    // Se tiver imagem, mostra a primeira. Se não, mostra ícone padrão.
    let imgHtml = '';
    if (data.anexos && data.anexos.length > 0) {
        imgHtml = `<img src="${data.anexos[0].arquivo}" class="post-thumb" alt="Foto da denúncia">`;
    } else {
        // Usa o ícone padrão definido no HTML (via window.STATIC_ICONS)
        const defaultIcon = window.STATIC_ICONS ? window.STATIC_ICONS.default_icon : '';
        imgHtml = `<img src="${defaultIcon}" class="post-thumb" style="object-fit:contain; padding:10px;" alt="Ícone">`;
    }

    const dataFormatada = new Date(data.data_criacao).toLocaleDateString('pt-BR');
    
    // Ícones estáticos (verificação de segurança)
    const icons = window.STATIC_ICONS || {};

    card.innerHTML = `
        <div class="post-header">
            <div class="bolinha-user" style="background-color: #ccc; background-image: url('${icons.default_icon || ''}'); background-size: cover;"></div> 
            <span class="nome-user">${userName}</span>
            <span style="font-size:12px; color:#999; margin-left:auto;">${dataFormatada}</span>
        </div>
        
        <div class="post-body">
            ${imgHtml}
            <div class="post-content">
                <div class="post-titulo">${formatarTipo(data.tipo)}</div>
                <div class="post-desc">${data.descricao}</div>
            </div>
        </div>

        <div class="post-acoes">
            <button class="btn-acao" title="Curtir"><img src="${icons.like || ''}"></button>
            <button class="btn-acao" title="Comentar"><img src="${icons.comment || ''}"></button>
            <button class="btn-acao" title="Compartilhar"><img src="${icons.share || ''}"></button>
            <div style="margin-left: auto; display:flex; gap:10px;">
                <button class="btn-acao" title="Salvar"><img src="${icons.star || ''}"></button>
                <button class="btn-acao" title="Ver status"><img src="${icons.alert || ''}"></button>
            </div>
        </div>
    `;

    return card;
}

function formatarTipo(tipo) {
    const tipos = {
        'violencia': 'Violência Urbana',
        'saneamento': 'Saneamento Básico',
        'planejamento': 'Infraestrutura',
        'meioambiente': 'Meio Ambiente'
    };
    return tipos[tipo] || tipo;
}

/* =============================================================
   LÓGICA DE EDIÇÃO DE PERFIL E CHAT
   ============================================================= */

function setupProfileActions() {
    // BOTÃO CHAT
    const btnChat = document.getElementById("btn-chat");
    if(btnChat) {
        btnChat.addEventListener("click", () => {
            alert("A funcionalidade de Chat estará disponível em breve!");
        });
    }

    // BOTÃO EDITAR (Abrir Modal)
    const btnEditar = document.getElementById("btn-editar-perfil");
    const modalEl = document.getElementById("modalEditarPerfil");
    let modalInstance = null;
    
    if (window.bootstrap && modalEl) {
        modalInstance = new bootstrap.Modal(modalEl);
    }

    if(btnEditar && modalInstance) {
        btnEditar.addEventListener("click", () => {
            modalInstance.show();
        });
    }

    // PREVIEW DA FOTO NO MODAL
    const inputFoto = document.getElementById("input-nova-foto");
    const previewDiv = document.getElementById("preview-foto");

    if(inputFoto) {
        inputFoto.addEventListener("change", function() {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    previewDiv.innerHTML = `<img src="${e.target.result}" style="width:100px; height:100px; border-radius:50%; object-fit:cover;">`;
                }
                reader.readAsDataURL(file);
            }
        });
    }

    // SALVAR PERFIL (ENVIAR PARA API)
    const btnSalvar = document.getElementById("btn-salvar-perfil");
    if(btnSalvar && inputFoto) {
        btnSalvar.addEventListener("click", async () => {
            const file = inputFoto.files[0];
            if (!file) {
                alert("Nenhuma alteração detectada (escolha uma foto nova).");
                return;
            }

            const formData = new FormData();
            formData.append('foto', file);
            
            const csrftoken = getCookie('csrftoken'); 

            try {
                btnSalvar.innerText = "Salvando...";
                btnSalvar.disabled = true;

                const response = await fetch('/users/api/atualizar-perfil/', {
                    method: 'POST',
                    headers: {
                        'X-CSRFToken': csrftoken
                    },
                    body: formData
                });

                if(response.ok) {
                    const data = await response.json();
                    
                    // 1. Atualiza a imagem grande do Perfil
                    const perfilImg = document.getElementById("perfil-img");
                    if (perfilImg) perfilImg.src = data.foto_url;

                    // 2. ATUALIZA O ÍCONE DA BARRA LATERAL (NOVO)
                    const headerAvatar = document.getElementById("header-user-avatar");
                    if (headerAvatar) {
                        headerAvatar.src = data.foto_url;
                    }

                    if(modalInstance) modalInstance.hide();
                    alert("Foto atualizada com sucesso!");
                } else {
                    alert("Erro ao atualizar perfil.");
                }
            } catch (error) {
                console.error(error);
                alert("Erro de conexão.");
            } finally {
                btnSalvar.innerText = "Salvar Alterações";
                btnSalvar.disabled = false;
            }
        });
    }
}

// Função auxiliar CSRF
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}