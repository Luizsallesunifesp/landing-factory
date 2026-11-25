(function () {
  // Flip das cartas ao toque. Funciona mesmo com --motion 0 (a transicao CSS vira instantanea).
  document.querySelectorAll('[data-secao="servicos-yahlla-06"]').forEach(function (root) {
    root.querySelectorAll('[data-card]').forEach(function (card) {
      card.addEventListener('click', function (e) {
        if (e.target.closest('a')) return;
        card.classList.toggle('flipped');
      });
    });
  });
})();
