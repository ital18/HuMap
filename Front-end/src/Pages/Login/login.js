// login.js

// 1. Seleciona o formulário pela classe existente no HTML
const form = document.querySelector('.formulario-login');

if (form) {
    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // Impede o recarregamento da página

        // 2. Seleciona os inputs pelos atributos 'type' (já que não temos IDs)
        // O método .querySelector busca o primeiro input que corresponda ao tipo dentro do form
        const emailInput = form.querySelector('input[type="email"]');
        const senhaInput = form.querySelector('input[type="password"]');

        const email = emailInput ? emailInput.value : '';
        const senha = senhaInput ? senhaInput.value : '';

        console.log("Enviando dados:", email); 

        try {
            // Conecta com a API Django
            const response = await fetch('http://127.0.0.1:8000/api/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username: email, password: senha })
            });

            const data = await response.json();

            if (response.ok) {
                alert("Login realizado com sucesso!");
                // Redirecionamento (descomente quando tiver a página de destino)
                // window.location.href = "/dashboard.html"; 
            } else {
                alert("Erro: " + (data.message || "Credenciais inválidas"));
            }

        } catch (error) {
            console.error('Erro:', error);
            alert("Erro ao conectar com o servidor.");
        }
    });
} else {
    console.error("Erro: O formulário '.formulario-login' não foi encontrado no HTML.");
}