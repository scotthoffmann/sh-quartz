// @ts-ignore
import galleryLightboxScript from "./scripts/galleryLightbox.inline"
import { QuartzComponent, QuartzComponentConstructor } from "./types"

const GalleryLightbox: QuartzComponent = () => {
  return null
}

GalleryLightbox.afterDOMLoaded = galleryLightboxScript

export default (() => GalleryLightbox) satisfies QuartzComponentConstructor
