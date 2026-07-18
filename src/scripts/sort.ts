function initSort() {
  const container = document.querySelector(".project-grid-cards");
  const controls = document.getElementById("sort-controls");
  const buttons = document.querySelectorAll(".sort-btn");

  if (!container || !controls) return;

  // Reveal the controls now that JS is available
  controls.removeAttribute("hidden");

  // Get all card elements as an array of DOM nodes
  const cards = Array.from(container.children) as HTMLElement[];

  const sortCards = (criteria: string) => {
    const sortedCards = [...cards];
    if (criteria === "newest") {
      sortedCards.sort((a, b) => {
        const dateA = new Date(a.dataset.published || "").getTime();
        const dateB = new Date(b.dataset.published || "").getTime();
        return dateB - dateA; // Newest first
      });
    } else if (criteria === "title") {
      sortedCards.sort((a, b) => {
        const titleA = a.dataset.title || "";
        const titleB = b.dataset.title || "";
        return titleA.localeCompare(titleB, undefined, { sensitivity: "base" }); // Alphabetical (A-Z)
      });
    }

    // Re-append cards in the new sorted order
    for (const card of sortedCards) {
      container.appendChild(card);
    }
  };

  for (const button of buttons) {
    button.addEventListener("click", () => {
      const criteria = button.getAttribute("data-sort") || "newest";

      // Update active state in UI and accessibility attributes
      for (const btn of buttons) {
        btn.setAttribute("aria-pressed", "false");
        btn.classList.remove("active");
      }
      button.setAttribute("aria-pressed", "true");
      button.classList.add("active");

      sortCards(criteria);
    });
  }
}

// Astro bundles this as a deferred module, so the DOM is normally parsed by the
// time it runs; guard the one case where it is not rather than relying on a
// DOMContentLoaded that may have already fired.
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initSort);
} else {
  initSort();
}
