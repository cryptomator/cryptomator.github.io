(() => {
  const root = document.querySelector("[data-embla-swipe-header]");
  if (!root || typeof EmblaCarousel === "undefined") {
    return;
  }

  const viewport = root.querySelector(".embla__viewport");
  if (!viewport) {
    return;
  }

  const panels = Array.from(root.querySelectorAll("[data-panel]"));
  const dots = Array.from(root.querySelectorAll("[data-swipe-dot]"));
  const align = (viewSize, snapSize, index) =>
    index === 0 ? 0 : Math.max(0, viewSize - snapSize);

  const embla = EmblaCarousel(viewport, {
    align,
    containScroll: false,
    loop: false,
  });

  const selectedIndex = () => embla.selectedScrollSnap();

  const updateActive = () => {
    const index = selectedIndex();
    const activeSide = index === 0 ? "left" : "right";
    root.dataset.active = index === 0 ? "left" : "right";
    panels.forEach((panel, panelIndex) => {
      panel.setAttribute("aria-pressed", panelIndex === index ? "true" : "false");
    });
    dots.forEach((dot) => {
      dot.setAttribute("aria-pressed", dot.dataset.swipeDot === activeSide ? "true" : "false");
    });
  };

  const initialIndex = root.dataset.active === "right" ? 1 : 0;
  embla.scrollTo(initialIndex, true);
  updateActive();
  embla.on("select", updateActive);
  embla.on("reInit", () => {
    updateActive();
  });

  const activatePanel = (index) => {
    if (index === selectedIndex()) {
      return;
    }
    embla.scrollTo(index);
  };

  panels.forEach((panel, index) => {
    panel.addEventListener("click", (event) => {
      if (event.defaultPrevented) {
        return;
      }
      const interactiveTarget = event.target.closest("a, button, input, select, textarea");
      if (interactiveTarget && index === selectedIndex()) {
        return;
      }
      activatePanel(index);
    });

    panel.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") {
        return;
      }
      event.preventDefault();
      activatePanel(index);
    });
  });

  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      activatePanel(dot.dataset.swipeDot === "right" ? 1 : 0);
    });
  });

})();
