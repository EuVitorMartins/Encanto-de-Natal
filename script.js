
/* =========================================
   ENCANTO DE NATAL — LOOP INFINITO
========================================= */

(() => {
  const viewport = document.querySelector("#carouselViewport");
  const track = document.querySelector("#carouselTrack");

  if (!viewport || !track) return;

  // Evita duplicar a faixa duas vezes.
  if (track.dataset.loopReady === "true") return;
  track.dataset.loopReady = "true";

  const originals = [...track.querySelectorAll(".carousel-card")];

  if (!originals.length) return;

  // Duplica os cartões para formar a sequência contínua.
  originals.forEach(card => {
    const clone = card.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    clone.querySelector("img")?.setAttribute("alt", "");
    track.appendChild(clone);
  });

  let frame = 0;

  // Mantém o destaque visual no cartão central.
  function updateActiveCard() {
    cancelAnimationFrame(frame);

    frame = requestAnimationFrame(() => {
      const cards = [...track.querySelectorAll(".carousel-card")];
      const viewportCenter = viewport.getBoundingClientRect().left
        + viewport.clientWidth / 2;

      let closestCard = null;
      let closestDistance = Infinity;

      cards.forEach(card => {
        card.classList.remove("is-active");

        const rect = card.getBoundingClientRect();
        const center = rect.left + rect.width / 2;
        const distance = Math.abs(center - viewportCenter);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestCard = card;
        }
      });

      closestCard?.classList.add("is-active");
    });
  }

  // Atualiza o destaque enquanto as imagens se movem.
  track.addEventListener("animationiteration", updateActiveCard);
  window.addEventListener("resize", updateActiveCard);

  // Atualiza periodicamente para acompanhar a animação.
  let animationFrame;

  function animateHighlight() {
    updateActiveCard();
    animationFrame = window.setTimeout(animateHighlight, 180);
  }

  animateHighlight();

  // Evita trabalho desnecessário quando a aba fica oculta.
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      window.clearTimeout(animationFrame);
    } else {
      animateHighlight();
    }
  });

  updateActiveCard();
})();
