document.addEventListener("DOMContentLoaded", () => {

  /* ---------- Card rendering (shared by carousel + search results) ---------- */
  function cardHTML(article, extraClass) {
    const bodyPreview = article.body.includes("<")
      ? article.body
      : `<p>${article.body}</p>`;

    return `
      <a class="paper-card ${extraClass || ""}" href="${article.slug}" data-id="${article.id}">
        <div class="paper-preview">
          <span class="piece-tag ${article.tag.toLowerCase()}">${article.tag}</span>
          <h3 class="card-title">${article.title}</h3>
          <div class="card-body-preview">${bodyPreview}</div>
          <span class="card-date">${article.date}</span>
        </div>
      </a>`;
  }

  /* ---------- Carousel ---------- */
  const track = document.getElementById("carousel-track");
  const viewport = document.getElementById("carousel-viewport");
  const prevBtn = document.getElementById("carousel-prev");
  const nextBtn = document.getElementById("carousel-next");
  let activeIndex = 0; // always start on the first piece

  if (track) {
    track.innerHTML = ARTICLES.map((a) => cardHTML(a)).join("");

    function updateCarousel() {
      const cards = track.querySelectorAll(".paper-card");
      cards.forEach((c, i) => c.classList.toggle("is-active", i === activeIndex));

      const activeCard = cards[activeIndex];
      if (activeCard) {
        const offset = activeCard.offsetLeft - (viewport.clientWidth / 2 - activeCard.offsetWidth / 2);
        track.style.transform = `translateX(${-offset}px)`;
      }

      prevBtn.disabled = activeIndex === 0;
      nextBtn.disabled = activeIndex === ARTICLES.length - 1;
    }

    prevBtn.addEventListener("click", () => {
      if (activeIndex > 0) { activeIndex--; updateCarousel(); }
    });
    nextBtn.addEventListener("click", () => {
      if (activeIndex < ARTICLES.length - 1) { activeIndex++; updateCarousel(); }
    });

    window.addEventListener("resize", updateCarousel);
    // Wait a tick for layout before first measurement
    requestAnimationFrame(updateCarousel);
  }

  /* ---------- Search ---------- */
  const searchInput = document.getElementById("search-input");
  const resultsGrid = document.getElementById("results-grid");
  const resultsEmpty = document.getElementById("results-empty");
  const stage = document.getElementById("writing-stage");

  if (searchInput) {
    searchInput.addEventListener("input", () => {
      const q = searchInput.value.trim().toLowerCase();

      if (!q) {
        stage.style.display = "";
        resultsGrid.classList.remove("is-visible");
        resultsEmpty.classList.remove("is-visible");
        return;
      }

      const matches = ARTICLES.filter((a) =>
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.body.toLowerCase().includes(q)
      );

      stage.style.display = "none";

      if (matches.length === 0) {
        resultsGrid.classList.remove("is-visible");
        resultsEmpty.classList.add("is-visible");
      } else {
        resultsEmpty.classList.remove("is-visible");
        resultsGrid.innerHTML = matches.map((a) => cardHTML(a)).join("");
        resultsGrid.classList.add("is-visible");
      }
    });
  }

  /* ---------- Subscribe form ---------- */
  const form = document.getElementById("subscribe-form");
  const statusEl = document.getElementById("subscribe-status");

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const btn = form.querySelector(".subscribe-btn");
      const emailInput = form.querySelector(".subscribe-input");

      btn.disabled = true;
      statusEl.textContent = "Sending...";
      statusEl.className = "subscribe-status";

      try {
        const res = await fetch(form.action, {
          method: "POST",
          headers: { Accept: "application/json" },
          body: new FormData(form)
        });

        if (res.ok) {
          statusEl.textContent = "You're in — check your inbox.";
          statusEl.className = "subscribe-status ok";
          emailInput.value = "";
        } else {
          statusEl.textContent = "Something went wrong — try again.";
          statusEl.className = "subscribe-status err";
        }
      } catch (err) {
        statusEl.textContent = "Something went wrong — try again.";
        statusEl.className = "subscribe-status err";
      } finally {
        btn.disabled = false;
      }
    });
  }
});
