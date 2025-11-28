   const hamburger = document.getElementById("hamburger");
        const menu = document.getElementById("menu");
        const btnClose = document.getElementById("btn-close");
        const notifBox = document.getElementById("notif-box");
        const notifyBtn = document.getElementById("notifyBtn");

        // ABRE MENU
        hamburger.onclick = () => {
            menu.classList.add("open");
        };

        
        btnClose.onclick = () => {
            menu.classList.remove("open");
        };

        // NOTIFICAÇÕES (abre/fecha)
        notifyBtn.onclick = (e) => {
            e.stopPropagation();
            notifBox.classList.toggle("open");
        };

        // Fechar notificações ao clicar fora
        document.body.onclick = () => {
            notifBox.classList.remove("open");
        };

        // SUGESTÕES DE ENDEREÇO
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