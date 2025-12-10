document.getElementById('form-cadastro').addEventListener('submit', async function(event) {
    event.preventDefault(); // Impede o recarregamento padrão da página

    const btn = document.getElementById('btn-cadastrar');
    const valorOriginal = btn.value;
    btn.value = "Cadastrando...";
    btn.disabled = true;

    // --- TRUQUE PARA LIDAR COM O HTML EXISTENTE ---
    // Como existem dois inputs com id="password" e name="password",
    // usamos querySelectorAll para pegar todos e acessar pelo índice.
    // [0] é a senha original, [1] é a confirmação.
    const camposSenha = document.querySelectorAll('input[name="password"]');
    const senha = camposSenha[0].value;
    const confirmarSenha = camposSenha[1].value;

    // Montando o objeto exatamente como o Django espera
    const formData = {
        nome: document.getElementById('nome').value,
        email: document.getElementById('email').value,
        password: senha,
        confirm_password: confirmarSenha, // O Serializer do Django vai comparar isso
        cpf: document.getElementById('cpf').value,
        data_nascimento: document.getElementById('dt-nascimento').value,
        telefone: document.getElementById('numero').value, // No HTML é 'numero', no Django é 'telefone'
        receber_notificacoes: document.getElementById('recebernoti').checked
    };

    try {
        // Envia para o backend
        const response = await fetch('http://127.0.0.1:8000/api/auth/cadastro/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            alert("Usuário cadastrado com sucesso!");
            // Redirecione para a sua tela de login aqui
            window.location.href = "/Front-end/login.html"; 
        } else {
            const erroData = await response.json();
            
            // Formata as mensagens de erro do Django para ficar legível
            let mensagemErro = "Erro ao cadastrar:\n";
            for (const campo in erroData) {
                // Ex: "password: As senhas não coincidem."
                mensagemErro += `- ${campo.toUpperCase()}: ${erroData[campo]}\n`;
            }
            alert(mensagemErro);
        }
    } catch (error) {
        console.error("Erro de conexão:", error);
        alert("Não foi possível conectar ao servidor. Verifique se o backend está rodando.");
    } finally {
        // Restaura o botão
        btn.value = valorOriginal;
        btn.disabled = false;
    }
});