document.addEventListener("DOMContentLoaded", () => {
  const filterBtns = document.querySelectorAll(".filter-btn");
  const rows = document.querySelectorAll(".piece-row[data-type]");
  const searchInput = document.getElementById("search");
  const emptyState = document.getElementById("empty-state");

  if (!filterBtns.length) return;

  let activeFilter = "all";

  function applyFilters() {
    const query = (searchInput.value || "").trim().toLowerCase();
    let visibleCount = 0;

    rows.forEach((row) => {
      const type = row.dataset.type;
      const title = row.querySelector(".piece-title-link").textContent.toLowerCase();
      const matchesFilter = activeFilter === "all" || type === activeFilter;
      const matchesSearch = title.includes(query);
      const show = matchesFilter && matchesSearch;
      row.style.display = show ? "" : "none";
      if (show) visibleCount++;
    });

    emptyState.style.display = visibleCount === 0 ? "block" : "none";
  }

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      activeFilter = btn.dataset.filter;
      applyFilters();
    });
  });

  searchInput.addEventListener("input", applyFilters);
});
