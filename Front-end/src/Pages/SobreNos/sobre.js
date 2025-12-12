/* Lógica específica da página Sobre Nós.
   
   NOTA: A lógica do Menu Lateral (hamburger), Notificações e Barra de Pesquisa
   agora é centralizada no arquivo 'base.html' / 'common_layout.css'.
   Não é necessário repetir esses códigos aqui.
*/

document.addEventListener('DOMContentLoaded', () => {
    
    // Animação de entrada suave para os cards da equipe
    const cards = document.querySelectorAll('.card-membro');
    
    if (cards.length > 0) {
        cards.forEach((card, index) => {
            // Define o estado inicial
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            
            // Aplica o atraso baseado no índice (efeito cascata)
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100); // 100ms de diferença entre cada card
        });
    }

    // Botão Voltar Fixo (caso você use o botão flutuante padrão)
    const btnVoltar = document.querySelector(".floating-button-home");
    if (btnVoltar) {
        // A lógica de redirecionamento já está no onclick do HTML, 
        // mas podemos adicionar efeitos extras aqui se quiser.
    }
});