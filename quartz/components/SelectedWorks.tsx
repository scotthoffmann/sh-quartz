import { QuartzComponent, QuartzComponentConstructor } from "./types"

const links: Array<{ label: string; href: string }> = [
  { label: "LinkedIn", href: "https://linkedin.com/in/scotthoffmann" },
  { label: "Instagram", href: "https://instagram.com/scotthoffmann" },
  { label: "Email", href: "mailto:scott@scotthoffmann.com" },
]

const SidebarLinks: QuartzComponent = () => {
  return (
    <nav class="sidebar-links">
      <div class="sidebar-links__content">
        <section class="sidebar-links__about">
          <p class="sidebar-links__line">
            Freelance photographer &
            <span>creative technician.</span>
          </p>
          <p>Based in New York City.</p>
          <p>
            Get in touch:{" "}
            <a href="mailto:scott@scotthoffmann.com">scott@scotthoffmann.com</a>
          </p>
        </section>
        <hr class="sidebar-links__divider" />
        <ul class="sidebar-links__list">
          {links.map(({ label, href }) => (
            <li>
              <a href={href} target="_blank" rel="noopener noreferrer">
                {label} →
              </a>
            </li>
          ))}
        </ul>
        <hr class="sidebar-links__divider" />
        <div class="sidebar-links__note">
          <p>
            Built with{" "}
            <a href="https://obsidian.md/" target="_blank" rel="noopener noreferrer">
              Obsidian
            </a>
            {" + "}
            <a href="https://quartz.jzhao.xyz/" target="_blank" rel="noopener noreferrer">
              Quartz
            </a>
            {". Augmented by "}
            <a href="https://openai.com/codex" target="_blank" rel="noopener noreferrer">
              Codex
            </a>
            .
          </p>
          <p>All images © Scott Hoffmann.</p>
        </div>
      </div>
    </nav>
  )
}

export default (() => SidebarLinks) satisfies QuartzComponentConstructor
