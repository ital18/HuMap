var defaultLat = -23.55052,
  defaultLng = -46.633308;
var map = L.map("map").setView([defaultLat, defaultLng], 15);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "© OpenStreetMap",
}).addTo(map);

// Marcador que o usuário arrasta para selecionar a localização da denúncia
var userMarker = L.marker([defaultLat, defaultLng], { draggable: true }).addTo(map);

// Definição dos subtemas
const SUBTEMAS = {
    // 🔴 Violência Urbana, Roubos e Crimes de Alta Periculosidade
    violencia: [
        { value: "assalto_pessoa", text: "Assalto/Roubo a pessoa" },
        { value: "furto_veiculo", text: "Furto de Veículo" },
        { value: "trafico", text: "Tráfico de drogas" },
        { value: "briga_desordem", text: "Briga/Desordem (Vandalismo)" },
        { value: "violencia_domestica", text: "Violência doméstica" },
        { value: "ameaca", text: "Ameaça" },
        { value: "homicidio", text: "Homicídio/Tentativa" },
        { value: "sequestro", text: "Sequestro" },
        { value: "violencia_sexual", text: "Violência sexual" },
        { value: "latrocinio", text: "Latrocínio" }
    ],
    // 💧 Saneamento Básico
    saneamento: [
        { value: "falta_agua", text: "Falta de água" },
        { value: "esgoto_aberto", text: "Esgoto a céu aberto" },
        { value: "lixo_acumulado", text: "Lixo acumulado (Terreno baldio, rua)" },
        { value: "alagamento", text: "Alagamento ou inundações recorrentes" },
        { value: "agua_contaminada", text: "Água contaminada (Suspeita)" },
        { value: "falta_coleta", text: "Falta de coleta de lixo" },
        { value: "cheiro_esgoto", text: "Cheiro forte de esgoto" },
        { value: "vazamento_rede", text: "Vazamento na rede de água" },
        { value: "fossa_estourada", text: "Fossa estourada" },
        { value: "entupimento_geral", text: "Entupimento geral na rede de esgoto" }
    ],
    // 🏙 Infraestrutura e Mobilidade Urbana (usando a chave 'planejamento')
    planejamento: [
        { value: "buracos_via", text: "Buracos na via/Asfalto ruim" },
        { value: "falta_iluminacao", text: "Falta ou falha na iluminação pública" },
        { value: "sinalizacao_ruim", text: "Sinalização de trânsito ruim ou ausente" },
        { value: "calcada_danificada", text: "Calçada danificada" },
        { value: "falta_acessibilidade", text: "Falta de acessibilidade (rampas, piso tátil)" },
        { value: "transporte_insuficiente", text: "Transporte público insuficiente/lotação" },
        { value: "ponto_onibus_ruim", text: "Ponto de ônibus danificado/ausente" },
        { value: "semaforo_apagado", text: "Semáforo apagado ou com falha" },
        { value: "falta_ciclovia", text: "Falta de ciclovia ou ciclofaixa" },
        { value: "obstrucao_calcada", text: "Obstrução de calçada (Carro, entulho)" }
    ],
    // 🌿 Meio Ambiente e Proteção Animal
    meioambiente: [
        { value: "corte_ilegal_arvores", text: "Corte ilegal/Desmatamento de árvores" },
        { value: "poluicao_rios", text: "Poluição de rios, lagos ou mares" },
        { value: "queimadas", text: "Queimadas ou incêndios" },
        { value: "maus_tratos_animais", text: "Maus-tratos ou crueldade contra animais" },
        { value: "descarte_irregular_lixo", text: "Descarte irregular de lixo/Entulho" },
        { value: "poluicao_sonora", text: "Poluição sonora (Barulho excessivo)" },
        { value: "caca_ilegal", text: "Caça/Pesca ilegal" },
        { value: "lixo_area_verde", text: "Lixo em área verde/Preservação" },
        { value: "residuos_industriais", text: "Descarte irregular de resíduos industriais" },
        { value: "animal_abandonado", text: "Animal abandonado/em situação de risco" }
    ]
};

// Array para armazenar as denúncias (simulando um banco de dados)
var activeReports = [
  // Exemplo de uma denúncia já existente para teste
  {
    tipo: 'Meio Ambiente - Descarte irregular', 
    descricao: 'Uma árvore grande caiu e está bloqueando a rua Alameda Santos.',
    lat: -23.5620,
    lng: -46.6560,
    data: new Date().toLocaleDateString('pt-BR')
  },
  {
    tipo: 'Violência - Roubo',
    descricao: 'Aumento de roubos a pedestres na região da Avenida Paulista.',
    lat: -23.5600,
    lng: -46.6560,
    data: new Date().toLocaleDateString('pt-BR')
  },
  {
    tipo: 'Saneamento - Falta de energia',
    descricao: 'Falta de energia há 24 horas na Rua Topázio.',
    lat: -23.5550,
    lng: -46.6450,
    data: new Date().toLocaleDateString('pt-BR')
  }
];

// Grupo de camadas para gerenciar os marcadores de denúncias ativas
var reportsLayer = L.layerGroup().addTo(map);

// Função para definir o ícone com base no tipo de denúncia
function getReportIcon(reportType) {
    let iconUrl = '';
    const typePrefix = reportType.toLowerCase().split(' - ')[0];

    if (typePrefix.includes('violencia')) {
        iconUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png';
    } else if (typePrefix.includes('saneamento')) {
        iconUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png';
    } else if (typePrefix.includes('planejamento')) {
        iconUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png';
    } else if (typePrefix.includes('meio ambiente')) { 
        iconUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png';
    } else {
        iconUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png';
    }

    return L.icon({
        iconUrl: iconUrl,
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });
}

// Função principal para carregar os marcadores de denúncias no mapa (AGORA LÊ DE CAMPO OCULTO)
function loadReportsOnMap() {
    // Pega o valor do filtro do campo oculto
    const filterValue = document.getElementById("reportFilter").value.toLowerCase();
    
    reportsLayer.clearLayers();

    activeReports.forEach(report => {
        const reportTypeLowerCase = report.tipo.toLowerCase();
        
        // Determina o prefixo do tipo de denúncia para comparação
        const reportPrefix = reportTypeLowerCase.split(' - ')[0].replace(' ', ''); // 'meioambiente' ou 'violencia'
        
        // Verifica se o relatório deve ser exibido
        const shouldDisplay = (filterValue === 'todos' || reportPrefix.includes(filterValue));

        if (shouldDisplay) {
            const icon = getReportIcon(report.tipo); 

            const reportMarker = L.marker([report.lat, report.lng], { icon: icon }).addTo(reportsLayer);
            
            const popupContent = `
                <h6>${report.tipo}</h6>
                <p>${report.descricao}</p>
                <small>📍 Lat: ${report.lat.toFixed(6)}, Lng: ${report.lng.toFixed(6)}</small>
            `;
            reportMarker.bindPopup(popupContent);
        }
    });
}

function updateCoords(lat, lng) {
  document.getElementById("lat").value = lat;
  document.getElementById("lng").value = lng;
  document.getElementById("coords").textContent =
    "Latitude: " + lat.toFixed(6) + " | Longitude: " + lng.toFixed(6);
}

// ----------------------- FUNÇÃO DE GEOLOCALIZAÇÃO REUTILIZÁVEL -----------------------

function getUserLocation(callback, isInitialLoad = false) {
  const locBtn = document.getElementById("locBtn");

  if (!navigator.geolocation) {
    if (!isInitialLoad) {
        alert("Geolocalização não é suportada por este navegador.");
    }
    return;
  }
  
  if (locBtn) {
    locBtn.disabled = true;
    locBtn.textContent = "Localizando...";
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      var lat = position.coords.latitude;
      var lng = position.coords.longitude;
      
      userMarker.setLatLng([lat, lng]);
      updateCoords(lat, lng);
      map.setView([lat, lng], 15);
      
      if (locBtn) {
        locBtn.disabled = false;
        locBtn.innerHTML =
          '<i class="bi bi-geo-alt-fill"></i> Usar minha localização';
      }
      if (callback) callback(true);
    },
    (err) => {
      if (!isInitialLoad) {
          alert("Erro ao obter localização: " + err.message);
      } else {
          console.log("Erro ao obter localização no carregamento: " + err.message);
      }
      if (locBtn) {
        locBtn.disabled = false;
        locBtn.innerHTML =
          '<i class="bi bi-geo-alt-fill"></i> Usar minha localização';
      }
      if (callback) callback(false);
    }, 
    { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
  );
}

// ----------------------- EVENTOS DE MAPA E BOTÃO -----------------------

updateCoords(defaultLat, defaultLng);

map.on("click", function (e) {
  userMarker.setLatLng(e.latlng);
  updateCoords(e.latlng.lat, e.latlng.lng);
});

userMarker.on("dragend", function () {
  var pos = userMarker.getLatLng();
  updateCoords(pos.lat, pos.lng);
});

document.getElementById("locBtn").addEventListener("click", function (e) {
  e.preventDefault();
  getUserLocation();
});

// Upload de arquivos
const fileInput = document.getElementById("fileInput");
const fileList = document.getElementById("fileList");
document
  .getElementById("addFile")
  .addEventListener("click", () => fileInput.click());

fileInput.addEventListener("change", () => {
  fileList.innerHTML = "";
  Array.from(fileInput.files).forEach((file, idx) => {
    const span = document.createElement("span");
    span.textContent = file.name;
    const removeIcon = document.createElement("i");
    removeIcon.className = "bi bi-x";
    removeIcon.onclick = () => {
      const dt = new DataTransfer();
      Array.from(fileInput.files).forEach((f, i) => {
        if (i !== idx) dt.items.add(f);
      });
      fileInput.files = dt.files;
      span.remove();
    };
    span.appendChild(removeIcon);
    fileList.appendChild(span);
  });
});

// ----------------------- LÓGICA DE SUBTEMAS -----------------------

const tipoSelect = document.getElementById("tipo");
const subtemaContainer = document.getElementById("subtemaContainer");
const subtemaSelect = document.getElementById("subtema");

tipoSelect.addEventListener("change", function() {
    const tipo = this.value;
    
    subtemaSelect.innerHTML = '<option value="" selected>Selecione o subtipo de denúncia</option>';
    
    if (tipo && SUBTEMAS[tipo]) {
        SUBTEMAS[tipo].forEach(sub => {
            const option = document.createElement('option');
            option.value = sub.value;
            option.textContent = sub.text;
            subtemaSelect.appendChild(option);
        });
        subtemaContainer.classList.remove('d-none');
    } else {
        subtemaContainer.classList.add('d-none');
    }
});


// ----------------------- LÓGICA DE ENVIO -----------------------

window.handleReportSubmission = function(e) {
  e.preventDefault(); 
  
  const tipo = document.getElementById("tipo").value; 
  const subtema = document.getElementById("subtema").value;
  const descricao = document.getElementById("descricao").value;
  const lat = parseFloat(document.getElementById("lat").value);
  const lng = parseFloat(document.getElementById("lng").value);
  const data = new Date().toLocaleDateString('pt-BR');
  
  let isValid = true;
  let errorMessage = "Erro no envio:\n";

  if (!tipo) {
    errorMessage += "- Selecione o tipo de denúncia.\n";
    isValid = false;
  } else if (SUBTEMAS[tipo] && !subtema) {
      errorMessage += "- Selecione o subtipo de denúncia.\n";
      isValid = false;
  }
  
  if (!descricao.trim()) {
    errorMessage += "- Preencha a descrição da denúncia.\n";
    isValid = false;
  }
  if (isNaN(lat) || isNaN(lng)) {
    errorMessage += "- Selecione uma localização válida no mapa.\n";
    isValid = false;
  }
  
  if (!isValid) {
    alert(errorMessage);
    const reportModalInstance = bootstrap.Modal.getOrCreateInstance(document.getElementById("reportModal"));
    reportModalInstance.show();
    return;
  }

  const tipoCompleto = subtema 
    ? tipo.charAt(0).toUpperCase() + tipo.slice(1) + " - " + subtema.charAt(0).toUpperCase() + subtema.slice(1)
    : tipo.charAt(0).toUpperCase() + tipo.slice(1);

  const newReport = { tipo: tipoCompleto, descricao, lat, lng, data };
  
  activeReports.push(newReport);

  loadReportsOnMap(); // Recarrega os relatórios (com o novo ponto)

  // Limpa o formulário e reseta
  document.getElementById("descricao").value = '';
  document.getElementById("tipo").value = '';
  document.getElementById("subtema").value = '';
  subtemaContainer.classList.add('d-none');
  fileList.innerHTML = '';
  updateCoords(defaultLat, defaultLng);
  userMarker.setLatLng([defaultLat, defaultLng]);
  
  const reportModalInstance = bootstrap.Modal.getInstance(document.getElementById("reportModal"));
  if (reportModalInstance) {
      reportModalInstance.hide();
  }
  
  setTimeout(() => {
    bootstrap.Modal.getOrCreateInstance(document.getElementById("successModal")).show();
  }, 100); 
  
};


// ----------------------- FUNÇÕES DE PESQUISA E GEOCODIFICAÇÃO -----------------------

const CEP_REGEX = /^\d{5}-?\d{3}$/;

async function geocodeAndMoveMap(query) {
    if (!query) return;

    const cleanQuery = query.replace(/[^\d]/g, '');
    let url = '';
    
    if (CEP_REGEX.test(cleanQuery)) {
        url = `https://nominatim.openstreetmap.org/search?postalcode=${encodeURIComponent(cleanQuery)}&country=Brazil&format=json&limit=1`;
    } else {
        url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1&countrycodes=br`;
    }
    
    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data && data.length > 0) {
            const lat = parseFloat(data[0].lat);
            const lng = parseFloat(data[0].lon);

            map.setView([lat, lng], 16);
            userMarker.setLatLng([lat, lng]);
            updateCoords(lat, lng);
            return true;
        } else {
            alert(`Localização "${query}" não encontrada.`);
            return false;
        }
    } catch (error) {
        console.error("Erro na geocodificação:", error);
        alert("Erro ao buscar a localização. Tente novamente mais tarde.");
        return false;
    }
}

async function fetchSuggestions(query) {
    if (query.length < 3 && !CEP_REGEX.test(query.replace(/[^\d]/g, ''))) return [];

    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5&countrycodes=br&addressdetails=1`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        return data.map(item => {
            const name = item.name || item.address.road || item.address.suburb || item.address.city_district || item.address.county || item.address.village;
            const city = item.address.city || item.address.town || item.address.village;
            const state = item.address.state_code || item.address.state;
            const postcode = item.address.postcode;

            let display = name ? name : item.display_name.split(',')[0].trim();
            
            let locationParts = [];
            if (city) locationParts.push(city);
            if (state) locationParts.push(state.split('-')[0].trim());

            if (locationParts.length > 0) {
                display += `, ${locationParts.join(' - ')}`;
            }

            if (postcode) {
                if (display.indexOf(postcode) === -1) {
                    display += ` [${postcode}]`;
                }
            }

            if (item.type === 'street' || item.type === 'road' || item.type === 'house' || item.type === 'building') {
                const parts = item.display_name.split(',');
                const streetName = parts[0].trim();
                const cityState = locationParts.join(' - ');
                display = `${streetName}, ${cityState}`;
                if (postcode) display += ` [${postcode}]`;
            }

            return display;
        });

    } catch (error) {
        console.error("Erro ao buscar sugestões:", error);
        return [];
    }
}

window.selectStreet = function(nomeRua) {
    const searchInput = document.getElementById("searchInput");
    const suggestionsBox = document.getElementById("suggestions");
    
    searchInput.value = nomeRua;
    suggestionsBox.style.display = "none";
    geocodeAndMoveMap(nomeRua);
}

window.goToSearch = function() {
    const searchInput = document.getElementById("searchInput");
    const valor = searchInput.value;
    if (!valor) return alert("Digite um local para pesquisar.");
    
    geocodeAndMoveMap(valor);
}

let suggestionTimeout;
window.showSuggestions = function() {
    const input = searchInput.value;
    const suggestionsBox = document.getElementById("suggestions");

    clearTimeout(suggestionTimeout);
    suggestionsBox.innerHTML = "";
    suggestionsBox.style.display = "none";

    const isPartialCEP = input.replace(/[^\d]/g, '').length >= 5;

    if (input.length < 3 && !isPartialCEP) {
        return;
    }

    suggestionTimeout = setTimeout(async () => {
        const suggestions = await fetchSuggestions(input);
        
        if (suggestions.length > 0) {
            suggestionsBox.innerHTML = suggestions
                .map(r => `<p onclick="selectStreet('${r.replace(/'/g, "\\'")}')">${r}</p>`)
                .join("");
            suggestionsBox.style.display = "block";
        } else {
            suggestionsBox.style.display = "none";
        }
    }, 300);
}


// ----------------------- LÓGICA DO NOVO FILTRO DROPDOWN -----------------------

document.addEventListener('DOMContentLoaded', function() {
    // Adiciona o listener para o dropdown (mantido)
    const filterDropdownMenu = document.getElementById('filterDropdownMenu');
    const reportFilterInput = document.getElementById('reportFilter');
    const filterDropdownButton = document.getElementById('filterDropdownButton');
    
    if (filterDropdownMenu) {
        // CORRIGIDO: Agora usa a classe `.opcao-filtro-home`
        filterDropdownMenu.addEventListener('click', function(e) {
            const item = e.target.closest('.opcao-filtro-home'); 
            if (item) {
                e.preventDefault();
                const newFilterValue = item.getAttribute('data-filter');
                const newFilterText = item.textContent;

                // 1. Atualiza o valor do campo oculto
                reportFilterInput.value = newFilterValue;
                
                // 2. Atualiza o texto do botão
                filterDropdownButton.innerHTML = `<i class="bi bi-funnel"></i> ${newFilterText}`;

                // 3. Marca o item ativo no dropdown
                // CORRIGIDO: Agora usa a classe `.opcao-filtro-home`
                filterDropdownMenu.querySelectorAll('.opcao-filtro-home').forEach(el => el.classList.remove('active'));
                item.classList.add('active');

                // 4. Recarrega os relatórios no mapa com o novo filtro
                loadReportsOnMap();
            }
        });
    }


    const menuToggleBtn = document.getElementById("menuToggleBtn");
    const sidebarMenu = document.getElementById("sidebarMenu");
    const sidebarOverlay = document.getElementById("sidebarOverlay");
    const btnCloseSidebar = document.getElementById("btn-close");
    
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
  
});


/* * A LÓGICA DE ALTERNÂNCIA DE TELA (toggleViewBtn, checkScreenSize)
 * FOI REMOVIDA POIS O FORMULÁRIO AGORA ESTÁ NO MODAL DO BOOTSTRAP.
 * O MAPA SEMPRE OCUPA A TELA.
 */

window.addEventListener("resize", () => {
  map.invalidateSize();
});

window.addEventListener("load", () => {
  setTimeout(() => map.invalidateSize(), 100);
  loadReportsOnMap(); // Carrega os relatórios iniciais (agora com filtro 'todos' do campo oculto)
  getUserLocation(null, true); 
});

// Função para carregar as denúncias do Django e por no mapa
async function carregarDenuncias() {
    try {
        const response = await fetch('http://127.0.0.1:8000/api/denuncias/');
        const denuncias = await response.json();

        // Ícones personalizados (ajuste as cores conforme sua pasta de assets ou use padrão)
        // Dica: Você pode criar ícones diferentes para cada tipo
        
        denuncias.forEach(d => {
            if (d.latitude && d.longitude) {
                // Cria o marcador usando o Leaflet (L) ou Google Maps
                // Supondo que você esteja usando Leaflet conforme seu HTML:
                
                let corIcone = 'blue'; // Padrão
                if (d.tipo === 'violencia') corIcone = 'red';
                if (d.tipo === 'saneamento') corIcone = 'blue';
                if (d.tipo === 'meioambiente') corIcone = 'green';
                if (d.tipo === 'planejamento') corIcone = 'orange';

                // Cria o texto do popup
                let popupContent = `
                    <b>${d.tipo.toUpperCase()}</b><br>
                    ${d.subtema ? `<i>${d.subtema}</i><br>` : ''}
                    <p>${d.descricao}</p>
                    <small>Em: ${new Date(d.data_criacao).toLocaleDateString()}</small>
                `;

                // Se tiver foto, adiciona a primeira no popup
                if (d.anexos && d.anexos.length > 0) {
                    // Ajusta a URL da imagem (o Django manda o caminho relativo)
                    const imgUrl = d.anexos[0].arquivo; 
                    popupContent += `<br><img src="${imgUrl}" style="width:100%; margin-top:5px; border-radius:4px;">`;
                }

                // Adiciona ao mapa (assumindo que sua variável do mapa se chama 'map')
                L.marker([d.latitude, d.longitude])
                 .bindPopup(popupContent)
                 .addTo(map);
            }
        });
        console.log(`${denuncias.length} denúncias carregadas.`);
        
    } catch (error) {
        console.error("Erro ao carregar denúncias:", error);
    }
}

// Chame essa função assim que o mapa iniciar
// Procure onde você tem o 'initMap' ou onde cria o 'L.map' e coloque:
// carregarDenuncias();
