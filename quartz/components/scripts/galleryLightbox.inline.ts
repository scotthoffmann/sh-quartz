const GALLERY_SELECTOR = ".gallery-grid figure";
const LIGHTBOX_ID = "gallery-lightbox";

let keyListenerBound = false;
let wheelListenerBound = false;
let figures: HTMLElement[] = [];
let currentIndex = -1;

let swipeStartX: number | null = null;
let swipeStartY: number | null = null;
const SWIPE_THRESHOLD = 160;
const WHEEL_THRESHOLD = 180;
let wheelCooldown = false;
const TAP_THRESHOLD = 14;

const ensureLightbox = () => {
  let container = document.getElementById(LIGHTBOX_ID);
  if (container) {
    return container;
  }

  container = document.createElement("div");
  container.id = LIGHTBOX_ID;
  container.className = "gallery-lightbox hidden";
  container.innerHTML = `
    <div class="gallery-lightbox__backdrop" data-action="dismiss"></div>
    <figure class="gallery-lightbox__content" role="dialog" aria-modal="true">
      <img alt="" />
      <figcaption></figcaption>
    </figure>
  `;
  document.body.appendChild(container);
  return container;
};

const isLightboxOpen = () => {
  const lightbox = document.getElementById(LIGHTBOX_ID);
  return lightbox?.classList.contains("open") ?? false;
};

const renderFigure = (figure: HTMLElement) => {
  const lightbox = ensureLightbox();
  const img = figure.querySelector<HTMLImageElement>("img");
  const caption = figure.querySelector<HTMLElement>("figcaption");
  if (!img) {
    return;
  }
  const lbImg = lightbox.querySelector<HTMLImageElement>("img");
  const lbCaption = lightbox.querySelector<HTMLElement>("figcaption");
  if (lbImg) {
    lbImg.src = img.src;
    lbImg.alt = img.alt;
  }
  if (lbCaption) {
    lbCaption.innerHTML = caption?.innerHTML ?? "";
  }
};

const openLightbox = (index: number) => {
  if (!figures.length) {
    return;
  }
  const lightbox = ensureLightbox();
  currentIndex = (index + figures.length) % figures.length;
  const figure = figures[currentIndex];
  renderFigure(figure);
  lightbox.classList.remove("hidden");
  lightbox.classList.add("open");
  document.body.classList.add("gallery-lightbox-open");
};

const closeLightbox = () => {
  const lightbox = document.getElementById(LIGHTBOX_ID);
  if (!lightbox) {
    return;
  }
  lightbox.classList.remove("open");
  lightbox.classList.add("hidden");
  document.body.classList.remove("gallery-lightbox-open");
};

const moveLightbox = (delta: number) => {
  if (!figures.length) {
    return;
  }
  const next = currentIndex + delta;
  if (next < 0 || next >= figures.length) {
    return;
  }
  openLightbox(next);
};

const bindLightbox = () => {
  const figureNodes = document.querySelectorAll<HTMLElement>(GALLERY_SELECTOR);
  if (!figureNodes.length) {
    return;
  }

  const lightbox = ensureLightbox();
  figures = Array.from(figureNodes);

  if (!lightbox.dataset.backdropBound) {
    lightbox.addEventListener("click", (event) => {
      const target = event.target as HTMLElement;
      if (target.dataset.action === "dismiss" || target === lightbox) {
        closeLightbox();
      }
    });
    lightbox.dataset.backdropBound = "true";
  }

  if (!lightbox.dataset.touchBound) {
    lightbox.addEventListener(
      "touchstart",
      (event) => {
        const touch = event.touches[0];
        swipeStartX = touch.clientX;
        swipeStartY = touch.clientY;
      },
      { passive: true },
    );
    lightbox.addEventListener(
      "touchend",
      (event) => {
        if (!isLightboxOpen() || swipeStartX === null || swipeStartY === null) {
          swipeStartX = swipeStartY = null;
          return;
        }
        const touch = event.changedTouches[0];
        const deltaX = touch.clientX - swipeStartX;
        const deltaY = touch.clientY - swipeStartY;
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > SWIPE_THRESHOLD) {
          if (deltaX < 0) {
            moveLightbox(1);
          } else if (deltaX > 0) {
            moveLightbox(-1);
          }
        }
        swipeStartX = swipeStartY = null;
      },
      { passive: true },
    );
    lightbox.dataset.touchBound = "true";
  }

  if (!keyListenerBound) {
    document.addEventListener("keydown", (event) => {
      if (!isLightboxOpen()) {
        return;
      }
      if (event.key === "Escape") {
        closeLightbox();
      } else if (event.key === "ArrowRight" || event.key === "ArrowDown" || event.key === "PageDown") {
        event.preventDefault();
        moveLightbox(1);
      } else if (event.key === "ArrowLeft" || event.key === "ArrowUp" || event.key === "PageUp") {
        event.preventDefault();
        moveLightbox(-1);
      }
    });
    keyListenerBound = true;
  }

  if (!wheelListenerBound) {
    lightbox.addEventListener(
      "wheel",
      (event) => {
        if (!isLightboxOpen()) {
          return;
        }
        event.preventDefault();
        if (Math.abs(event.deltaY) < WHEEL_THRESHOLD || wheelCooldown) {
          return;
        }
        wheelCooldown = true;
        if (event.deltaY > 0) {
          moveLightbox(1);
        } else if (event.deltaY < 0) {
          moveLightbox(-1);
        }
        window.setTimeout(() => {
          wheelCooldown = false;
        }, 250);
      },
      { passive: false },
    );
    wheelListenerBound = true;
  }

  figures.forEach((figure, index) => {
    if (figure.dataset.lightboxBound === "true") {
      return;
    }
    figure.dataset.lightboxBound = "true";
    figure.dataset.lightboxIndex = index.toString();

    const image = figure.querySelector<HTMLImageElement>("img");
    if (!image) {
      return;
    }

    image.addEventListener("contextmenu", (event) => {
      event.preventDefault();
    });

    let touchTapStartX: number | null = null;
    let touchTapStartY: number | null = null;
    let touchTapMoved = false;
    let ignoreNextClick = false;

    figure.addEventListener("touchstart", (event) => {
      const touch = event.touches[0];
      touchTapStartX = touch.clientX;
      touchTapStartY = touch.clientY;
      touchTapMoved = false;
    }, { passive: true });

    figure.addEventListener("touchmove", (event) => {
      if (touchTapStartX === null || touchTapStartY === null) {
        return;
      }
      const touch = event.touches[0];
      if (touchTapMoved) {
        return;
      }
      if (Math.abs(touch.clientX - touchTapStartX) > TAP_THRESHOLD || Math.abs(touch.clientY - touchTapStartY) > TAP_THRESHOLD / 2) {
        touchTapMoved = true;
      }
    }, { passive: true });

    figure.addEventListener("touchend", () => {
      if (touchTapStartX !== null && touchTapStartY !== null) {
        if (!touchTapMoved) {
          ignoreNextClick = true;
          openLightbox(index);
        } else {
          ignoreNextClick = true;
        }
      }
      touchTapStartX = touchTapStartY = null;
      touchTapMoved = false;
    }, { passive: true });

    figure.addEventListener("click", () => {
      if (ignoreNextClick) {
        ignoreNextClick = false;
        return;
      }
      openLightbox(index);
    });

    figure.setAttribute("role", "button");
    figure.setAttribute("tabindex", "0");
    const captionText = figure.querySelector<HTMLElement>("figcaption")?.textContent ?? image.alt;
    if (captionText) {
      figure.setAttribute("aria-label", captionText);
    }

    figure.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openLightbox(index);
      }
    });
  });
};

setTimeout(bindLightbox, 0);
document.addEventListener("nav", () => {
  setTimeout(bindLightbox, 0);
});

export {};
