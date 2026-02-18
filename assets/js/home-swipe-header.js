(() => {
  const root = document.querySelector("[data-swipe-header]");
  if (!root) {
    return;
  }

  const panels = Array.from(root.querySelectorAll("[data-panel]"));
  let resizeTimer = null;
  const updateMetrics = () => {
    const height = root.getBoundingClientRect().height;
    if (height > 0) {
      root.style.setProperty("--swipe-max-height", `${height}px`);
    }
    const header = root.querySelector(".swipe-header");
    if (header) {
      const width = header.getBoundingClientRect().width;
      if (width > 0) {
        const isDesktop = window.matchMedia("(min-width: 768px)").matches;
        const targetWidth = isDesktop ? width * 0.8 : width;
        root.style.setProperty("--swipe-active-width", `${Math.round(targetWidth)}px`);
      }
    }
  };

  const queueHeightUpdate = () => {
    if (resizeTimer) {
      window.clearTimeout(resizeTimer);
    }
    resizeTimer = window.setTimeout(() => {
      updateMetrics();
      resizeTimer = null;
    }, 150);
  };

  updateMetrics();
  window.addEventListener("load", updateMetrics);
  window.addEventListener("resize", queueHeightUpdate);
  root.addEventListener("load", updateMetrics, true);
  document.addEventListener("lazyloaded", updateMetrics);

  let animationTimer = null;
  const setActive = (side) => {
    if (root.dataset.active === side) {
      return;
    }

    const previous = root.dataset.active;
    const previousPanel = panels.find(
      (panel) => panel.dataset.panel === previous
    );
    const previousContent = previousPanel
      ? previousPanel.querySelector(".swipe-panel__content")
      : null;
    const previousBody = previousPanel
      ? previousPanel.querySelector(".swipe-panel__body")
      : null;
    if (previousPanel && previousContent) {
      const panelRect = previousPanel.getBoundingClientRect();
      const contentRect = previousContent.getBoundingClientRect();
      if (contentRect.width && contentRect.height) {
        previousPanel.style.setProperty(
          "--swipe-content-width",
          `${contentRect.width}px`
        );
        previousPanel.style.setProperty(
          "--swipe-content-height",
          `${contentRect.height}px`
        );
        previousPanel.style.setProperty(
          "--swipe-content-top",
          `${contentRect.top - panelRect.top}px`
        );
        previousPanel.style.setProperty(
          "--swipe-content-left",
          `${contentRect.left - panelRect.left}px`
        );
      }
    }
    if (previousPanel && previousBody) {
      const bodyRect = previousBody.getBoundingClientRect();
      if (bodyRect.height) {
        previousPanel.style.setProperty(
          "--swipe-body-height",
          `${bodyRect.height}px`
        );
      }
    }
    root.dataset.animatingOut = previous;
    if (animationTimer) {
      window.clearTimeout(animationTimer);
    }
    animationTimer = window.setTimeout(() => {
      root.dataset.active = side;
      panels.forEach((panel) => {
        const isActive = panel.dataset.panel === side;
        panel.setAttribute("aria-pressed", isActive ? "true" : "false");
      });
      root.dataset.animating = side;
      window.setTimeout(() => {
        if (root.dataset.animating === side) {
          root.dataset.animating = "";
        }
      }, 520);
      if (root.dataset.animatingOut === previous) {
        root.dataset.animatingOut = "";
      }
      if (previousPanel) {
        previousPanel.style.removeProperty("--swipe-content-width");
        previousPanel.style.removeProperty("--swipe-content-height");
        previousPanel.style.removeProperty("--swipe-content-top");
        previousPanel.style.removeProperty("--swipe-content-left");
        previousPanel.style.removeProperty("--swipe-body-height");
      }
      animationTimer = null;
    }, 520);
  };

  root.addEventListener("click", (event) => {
    const panel = event.target.closest("[data-panel]");
    if (!panel) {
      return;
    }
    setActive(panel.dataset.panel);
  });

  root.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }
    const panel = event.target.closest("[data-panel]");
    if (!panel) {
      return;
    }
    event.preventDefault();
    setActive(panel.dataset.panel);
  });

  let startX = null;
  root.addEventListener("pointerdown", (event) => {
    startX = event.clientX;
  });

  root.addEventListener("pointerup", (event) => {
    if (startX === null) {
      return;
    }
    const dx = event.clientX - startX;
    if (Math.abs(dx) > 40) {
      setActive(dx < 0 ? "right" : "left");
    }
    startX = null;
  });

  root.addEventListener("pointercancel", () => {
    startX = null;
  });
})();
