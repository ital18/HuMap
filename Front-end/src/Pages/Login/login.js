// login.js
const form = document.querySelector('.form');

form.addEventListener('submit', async (event) => {
    event.preventDefault(); // Impede o formulário de recarregar a página

    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    console.log("Enviando dados:", email); // Para você ver no F12 se funcionou

    try {
        // Conecta com o Django na porta 8000
        const response = await fetch('http://127.0.0.1:8000/api/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: email, password: senha }) 
            // OBS: O Django padrão espera "username" e "password"
        });

        const data = await response.json();

        if (response.ok) {
            alert("Login realizado com sucesso!");
            window.location.href = "/dashboard.html"; // Exemplo de redirecionamento
        } else {
            alert("Erro: " + data.message);
        }

    } catch (error) {
        console.error('Erro:', error);
        alert("Erro ao conectar com o servidor.");
    }
});