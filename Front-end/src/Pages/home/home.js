/* =============================================================
   CONFIGURAÇÕES GLOBAIS E DADOS
   ============================================================= */

var defaultLat = -8.0476, // Recife
    defaultLng = -34.8770;

var map;
var userMarker; // Pino vermelho (seleção do usuário)
var reportsLayer; // Camada dos pinos azuis (denúncias do banco)
var allDenuncias = []; // Armazena os dados baixados da API

// Pega os ícones definidos no HTML (window.STATIC_URLS)
const ICONS_SOURCE = window.STATIC_URLS || {};

// Subtemas para o dropdown
const SUBTEMAS = {
    violencia: [
        { value: "assalto_pessoa", text: "Assalto/Roubo a pessoa" },
        { value: "furto_veiculo", text: "Furto de Veículo" },
        { value: "trafico", text: "Tráfico de drogas" },
        { value: "briga_desordem", text: "Briga/Desordem" },
        { value: "violencia_domestica", text: "Violência doméstica" },
        { value: "homicidio", text: "Homicídio/Tentativa" }
    ],
    saneamento: [
        { value: "falta_agua", text: "Falta de água" },
        { value: "esgoto_aberto", text: "Esgoto a céu aberto" },
        { value: "lixo_acumulado", text: "Lixo acumulado" },
        { value: "alagamento", text: "Alagamento" },
        { value: "buraco_via", text: "Buraco na via" }
    ],
    planejamento: [
        { value: "falta_iluminacao", text: "Falta de iluminação" },
        { value: "sinalizacao_ruim", text: "Sinalização ruim" },
        { value: "calcada_danificada", text: "Calçada danificada" },
        { value: "transporte_insuficiente", text: "Transporte público insuficiente" }
    ],
    meioambiente: [
        { value: "corte_ilegal_arvores", text: "Corte ilegal de árvores" },
        { value: "poluicao_rios", text: "Poluição de rios" },
        { value: "queimadas", text: "Queimadas" },
        { value: "maus_tratos_animais", text: "Maus-tratos animais" }
    ]
};

/* =============================================================
   INICIALIZAÇÃO
   ============================================================= */

document.addEventListener('DOMContentLoaded', () => {
    initMap();
    carregarDenuncias(); // Busca dados do banco ao carregar
    setupInteractions(); // Configura botões, filtros e formulário
});

function initMap() {
    if (!document.getElementById("map")) return;

    // 1. Inicializa o mapa
    map = L.map('map').setView([defaultLat, defaultLng], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Cria o grupo de camadas para os pinos
    reportsLayer = L.layerGroup().addTo(map);

    // 2. Clique no mapa para marcar local (apenas para nova denúncia)
    map.on('click', function(e) {
        selecionarLocalNoMapa(e.latlng.lat, e.latlng.lng);
    });
}

/* =============================================================
   LÓGICA DE DADOS (API DJANGO)
   ============================================================= */

// 1. BUSCAR DENÚNCIAS (GET)
async function carregarDenuncias() {
    try {
        console.log("📡 Buscando denúncias no servidor...");
        const response = await fetch('/api/denuncias/');
        
        if (!response.ok) {
            console.error("❌ Erro na API:", response.status);
            return;
        }
        
        const data = await response.json();
        console.log(`✅ ${data.length} denúncias carregadas.`);

        allDenuncias = data;
        renderizarMarcadores(allDenuncias);

    } catch (error) {
        console.error("❌ Erro de conexão:", error);
    }
}

// 2. RENDERIZAR MARCADORES NO MAPA
function renderizarMarcadores(lista) {
    if (!reportsLayer) return;
    reportsLayer.clearLayers(); // Limpa para não duplicar

    lista.forEach(d => {
        // CONVERSÃO E VALIDAÇÃO DE COORDENADAS
        const lat = parseFloat(d.latitude);
        const lng = parseFloat(d.longitude);

        if (isNaN(lat) || isNaN(lng)) return; // Pula se inválido

        // Escolhe o ícone
        const iconUrl = ICONS_SOURCE[d.tipo] || 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png';
        
        const customIcon = L.icon({
            iconUrl: iconUrl,
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32]
        });

        // Cria o pino
        const pin = L.marker([lat, lng], { icon: customIcon }).addTo(reportsLayer);

        // Cria o conteúdo do Popup
        let html = `
            <div style="text-align:center; min-width: 200px;">
                <h6 style="color:#005BB5; font-weight:bold; margin-bottom:5px;">${formatarTipo(d.tipo)}</h6>
                <p style="font-size:13px; margin:5px 0;">${d.descricao || "Sem descrição"}</p>
                <small style="color:#666;">Por: ${d.usuario_nome || "Anônimo"}</small>
                <br>
                <small style="color:#999; font-size:10px;">${new Date(d.data_criacao).toLocaleDateString()}</small>
        `;

        // Adiciona foto se houver
        if (d.anexos && d.anexos.length > 0) {
            html += `<br><img src="${d.anexos[0].arquivo}" style="width:100%; height:auto; margin-top:10px; border-radius:5px; object-fit:cover;">`;
        }

        html += `</div>`;
        pin.bindPopup(html);
    });
}

// 3. ENVIAR DENÚNCIA (POST)
window.handleReportSubmission = async function(event) {
    event.preventDefault();

    const tipo = document.getElementById('tipo').value;
    const subtema = document.getElementById('subtema').value;
    const descricao = document.getElementById('descricao').value;
    const lat = document.getElementById('lat').value;
    const lng = document.getElementById('lng').value;
    const fileInput = document.getElementById('fileInput');

    if (!tipo || !descricao || !lat) {
        alert("Preencha o tipo, a descrição e marque um ponto no mapa!");
        return;
    }

    const formData = new FormData();
    formData.append('tipo', tipo);
    formData.append('subtema', subtema);
    formData.append('descricao', descricao);
    formData.append('latitude', lat);
    formData.append('longitude', lng);

    if (fileInput.files.length > 0) {
        for (let i = 0; i < fileInput.files.length; i++) {
            formData.append('imagens', fileInput.files[i]); 
        }
    }

    try {
        const btn = document.getElementById('sendReportBtn');
        const txtOriginal = btn.innerText;
        btn.innerText = "Enviando...";
        btn.disabled = true;

        const csrftoken = getCookie('csrftoken');

        const response = await fetch('/api/denuncias/', {
            method: 'POST',
            headers: { 'X-CSRFToken': csrftoken },
            body: formData
        });

        if (response.ok) {
            // Sucesso!
            fecharModal('reportModal');
            
            const successModal = new bootstrap.Modal(document.getElementById('successModal'));
            successModal.show();

            limparFormulario();
            carregarDenuncias(); // Recarrega do banco para aparecer no mapa
        } else {
            const err = await response.json();
            alert("Erro ao salvar: " + JSON.stringify(err));
        }
    } catch (error) {
        console.error(error);
        alert("Erro de conexão.");
    } finally {
        const btn = document.getElementById('sendReportBtn');
        if(btn) {
            btn.innerText = "Enviar";
            btn.disabled = false;
        }
    }
};

/* =============================================================
   INTERAÇÕES DE UI (UI Helpers)
   ============================================================= */

function setupInteractions() {
    // Botão de Localização
    const btnLoc = document.getElementById('locBtn');
    if (btnLoc) {
        btnLoc.addEventListener('click', (e) => {
            e.preventDefault();
            getUserLocation();
        });
    }

    // Input de Arquivo (Visualização do nome)
    const fileInput = document.getElementById("fileInput");
    const fileList = document.getElementById("fileList");
    if (fileInput && fileList) {
        document.getElementById("addFile").addEventListener("click", (e) => {
            e.preventDefault();
            fileInput.click();
        });
        fileInput.addEventListener("change", () => {
            fileList.innerHTML = "";
            Array.from(fileInput.files).forEach(file => {
                const span = document.createElement("span");
                span.textContent = "📎 " + file.name;
                span.style.display = "block";
                span.style.fontSize = "12px";
                fileList.appendChild(span);
            });
        });
    }

    // Dropdown de Subtemas Dinâmico
    const tipoSelect = document.getElementById("tipo");
    const subtemaContainer = document.getElementById("subtemaContainer");
    const subtemaSelect = document.getElementById("subtema");

    if (tipoSelect) {
        tipoSelect.addEventListener("change", function() {
            const tipo = this.value;
            subtemaSelect.innerHTML = '<option value="" selected>Selecione o subtipo</option>';
            
            if (tipo && SUBTEMAS[tipo]) {
                SUBTEMAS[tipo].forEach(sub => {
                    const opt = document.createElement('option');
                    opt.value = sub.value;
                    opt.textContent = sub.text;
                    subtemaSelect.appendChild(opt);
                });
                subtemaContainer.classList.remove('d-none');
            } else {
                subtemaContainer.classList.add('d-none');
            }
        });
    }

    // Filtros de Mapa (Navbar ou Botão Flutuante)
    const filterMenu = document.getElementById('filterDropdownMenu');
    if (filterMenu) {
        filterMenu.addEventListener('click', (e) => {
            const item = e.target.closest('a');
            if (item) {
                e.preventDefault();
                const filtro = item.getAttribute('data-filter');
                document.getElementById('filterDropdownButton').innerHTML = `<i class="bi bi-funnel"></i> ${item.textContent}`;
                filtrarMapa(filtro);
            }
        });
    }
}

function filtrarMapa(tipoFiltro) {
    if (tipoFiltro === 'todos') {
        renderizarMarcadores(allDenuncias);
    } else {
        const filtrados = allDenuncias.filter(d => d.tipo === tipoFiltro);
        renderizarMarcadores(filtrados);
    }
}

// CORREÇÃO FEITA AQUI: toFixed(6) para limitar casas decimais
function selecionarLocalNoMapa(lat, lng) {
    document.getElementById('lat').value = lat.toFixed(6);
    document.getElementById('lng').value = lng.toFixed(6);
    
    const coordsDiv = document.getElementById('coords');
    if(coordsDiv) coordsDiv.innerHTML = `<span style="color:green; font-weight:bold;">Local marcado!</span>`;

    if (userMarker) {
        userMarker.setLatLng([lat, lng]);
    } else {
        userMarker = L.marker([lat, lng], {draggable: true}).addTo(map);
        userMarker.on('dragend', function(e) {
            selecionarLocalNoMapa(e.target.getLatLng().lat, e.target.getLatLng().lng);
        });
    }
}

function getUserLocation() {
    const btn = document.getElementById('locBtn');
    btn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Localizando...';
    
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            map.setView([lat, lng], 16);
            selecionarLocalNoMapa(lat, lng);
            btn.innerHTML = '<i class="bi bi-geo-alt-fill"></i> Localização encontrada';
        }, () => {
            alert("Não foi possível obter a localização.");
            btn.innerHTML = '<i class="bi bi-geo-alt-fill"></i> Usar minha localização';
        });
    } else {
        alert("Geolocalização não suportada.");
    }
}

/* =============================================================
   UTILITÁRIOS
   ============================================================= */

function formatarTipo(tipo) {
    const nomes = {
        'violencia': 'Violência Urbana',
        'saneamento': 'Saneamento Básico',
        'planejamento': 'Infraestrutura',
        'meioambiente': 'Meio Ambiente'
    };
    return nomes[tipo] || tipo;
}

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

function fecharModal(modalId) {
    const modalEl = document.getElementById(modalId);
    if(modalEl && window.bootstrap) {
        const modalInstance = bootstrap.Modal.getInstance(modalEl);
        if (modalInstance) modalInstance.hide();
    }
}

function limparFormulario() {
    document.getElementById("descricao").value = '';
    document.getElementById("tipo").value = '';
    document.getElementById("subtema").value = '';
    
    const subContainer = document.getElementById("subtemaContainer");
    if(subContainer) subContainer.classList.add('d-none');
    
    const coordsDiv = document.getElementById("coords");
    if(coordsDiv) coordsDiv.textContent = 'Nenhuma coordenada selecionada';
    
    const fileList = document.getElementById("fileList");
    if(fileList) fileList.innerHTML = '';
    
    // Remove o pino de seleção vermelho (mas deixa os azuis)
    if(userMarker) {
        map.removeLayer(userMarker);
        userMarker = null;
    }
}