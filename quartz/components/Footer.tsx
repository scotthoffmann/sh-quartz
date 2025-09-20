import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import style from "./styles/footer.scss"

interface Options {
  links: Record<string, string>
}

export default ((opts?: Options) => {
  const Footer: QuartzComponent = ({ displayClass }: QuartzComponentProps) => {
    const links = opts?.links ?? []
    return (
      <footer class={`${displayClass ?? ""}`}>
        <p>
          Built with{" "}
          <a href="https://obsidian.md/" target="_blank" rel="noopener noreferrer">
            Obsidian
          </a>
          {", "}
          <a href="https://quartz.jzhao.xyz/" target="_blank" rel="noopener noreferrer">
            Quartz
          </a>
          {", and "}
          <a href="https://openai.com/codex" target="_blank" rel="noopener noreferrer">
            Codex
          </a>
          .
        </p>
        <ul>
          {Object.entries(links).map(([text, link]) => (
            <li>
              <a href={link} target="_blank" rel="noopener noreferrer">
                {text}
              </a>
            </li>
          ))}
        </ul>
      </footer>
    )
  }

  Footer.css = style
  return Footer
}) satisfies QuartzComponentConstructor
