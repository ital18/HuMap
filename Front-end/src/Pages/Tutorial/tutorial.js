// O código de menu, sidebar e notificação foi removido e agora é controlado pelo base/base.html

document.addEventListener('DOMContentLoaded', function() {
    
    const suggestionsBox = document.getElementById("suggestions");
    const searchInput = document.getElementById("searchInput");
    
    // Funções de busca (simuladas) - Adaptadas de home.js / script.js
    window.showSuggestions = function() {
        if (!searchInput || !suggestionsBox) return;
        const input = searchInput.value;
        const box = suggestionsBox;

        if (input.length < 2) {
            box.innerHTML = "";
            box.style.display = "none";
            return;
        }

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
        if (!searchInput || !suggestionsBox) return;
        searchInput.value = nomeRua;
        suggestionsBox.style.display = "none";
        alert("Indo para: " + nomeRua);
    }

    window.goToSearch = function() {
        if (!searchInput) return;
        const valor = searchInput.value;
        if (!valor) return alert("Digite um local para pesquisar.");
        alert("Buscando: " + valor);
    }

});