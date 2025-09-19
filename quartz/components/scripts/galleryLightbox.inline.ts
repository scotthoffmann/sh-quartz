const GALLERY_SELECTOR = ".gallery-grid figure";
const LIGHTBOX_ID = "gallery-lightbox";

let keyListenerBound = false;

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

const openLightbox = (figure: HTMLElement) => {
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

const bindLightbox = () => {
  const figures = document.querySelectorAll<HTMLElement>(GALLERY_SELECTOR);
  if (!figures.length) {
    return;
  }

  const lightbox = ensureLightbox();

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
      if (event.key === "Escape") {
        closeLightbox();
      }
    });
    keyListenerBound = true;
  }

  figures.forEach((figure) => {
    if (figure.dataset.lightboxBound === "true") {
      return;
    }
    figure.dataset.lightboxBound = "true";

    const image = figure.querySelector<HTMLImageElement>("img");
    if (!image) {
      return;
    }

    image.addEventListener("contextmenu", (event) => {
      event.preventDefault();
    });

    figure.addEventListener("click", () => {
      openLightbox(figure);
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
        openLightbox(figure);
      }
    });
  });
};

setTimeout(bindLightbox, 0);
document.addEventListener("nav", () => {
  setTimeout(bindLightbox, 0);
});

export {};
