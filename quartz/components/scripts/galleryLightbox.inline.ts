const GALLERY_SELECTOR = ".gallery-grid figure";
const LIGHTBOX_ID = "gallery-lightbox";

let keyListenerBound = false;
let wheelListenerBound = false;
let figures: HTMLElement[] = [];
let currentIndex = -1;

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
        if (Math.abs(event.deltaY) < 30) {
          return;
        }
        if (event.deltaY > 0) {
          moveLightbox(1);
        } else if (event.deltaY < 0) {
          moveLightbox(-1);
        }
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

    figure.addEventListener("click", () => {
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
