document.querySelector('.formulario-login').addEventListener('submit', async function(event) {
    event.preventDefault(); // Impede a página de recarregar sozinha

    // Pegando o botão para dar feedback visual
    const botao = document.querySelector('button[type="submit"]');
    const textoOriginal = botao.innerText;
    botao.innerText = "Entrando...";
    botao.disabled = true;

    // Pegando os valores dos inputs pelo TIPO (já que não têm ID)
    const email = document.querySelector('input[type="email"]').value;
    const password = document.querySelector('input[type="password"]').value;

    try {
        // Envia para o seu Backend Django
        const response = await fetch('http://127.0.0.1:8000/api/auth/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        const data = await response.json();

        if (response.ok) {
            // Sucesso!
            // Vamos salvar o nome do usuário no navegador para usar na Home depois
            localStorage.setItem('usuario_humap', data.user);
            
            // Se o backend retornou ID, salvamos também
            if(data.id) localStorage.setItem('usuario_id', data.id);

            alert("Login realizado com sucesso!");
            
            // REDIRECIONAMENTO: Ajuste aqui para o nome da sua página principal
            // Pode ser index.html, home.html, etc.
            window.location.href = "/index.html"; 
        } else {
            // Erro (Senha errada ou usuário não existe)
            alert("Erro: " + data.message);
        }

    } catch (error) {
        console.error("Erro de conexão:", error);
        alert("Não foi possível conectar ao servidor.");
    } finally {
        // Restaura o botão ao normal
        botao.innerText = textoOriginal;
        botao.disabled = false;
    }
});