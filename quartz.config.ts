import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

/**
 * Quartz 4 Configuration
 *
 * See https://quartz.jzhao.xyz/configuration for more information.
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "SCOTT HOFFMANN",
    pageTitleSuffix: "",
    enableSPA: true,
    enablePopovers: true,
    analytics: {
      provider: "plausible",
    },
    locale: "en-US",
    baseUrl: "scotthoffmann.com",
    ignorePatterns: ["private", "templates", ".obsidian"],
    defaultDateType: "modified",
    theme: {
      fontOrigin: "googleFonts",
      cdnCaching: true,
      typography: {
        header: "Azeret Mono",
        body: "Azeret Mono",
        code: "Azeret Mono",
      },
      colors: {
        lightMode: {
          light: "#100F0F",
          lightgray: "#1C1B1A",
          gray: "#343331",
          darkgray: "#DAD8CE",
          dark: "#FFFCF0",
          secondary: "#DAD8CE",
          tertiary: "#FFFCF0",
          highlight: "rgba(255, 252, 240, 0.2)",
          textHighlight: "rgba(218, 216, 206, 0.3)",
        },
        darkMode: {
          light: "#100F0F",
          lightgray: "#1C1B1A",
          gray: "#343331",
          darkgray: "#DAD8CE",
          dark: "#FFFCF0",
          secondary: "#DAD8CE",
          tertiary: "#FFFCF0",
          highlight: "rgba(255, 252, 240, 0.2)",
          textHighlight: "rgba(218, 216, 206, 0.3)",
        },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "git", "filesystem"],
      }),
      Plugin.SyntaxHighlighting({
        theme: {
          light: "github-light",
          dark: "github-dark",
        },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
      Plugin.Latex({ renderEngine: "katex" }),
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.Favicon(),
      Plugin.NotFoundPage(),
      // Comment out CustomOgImages to speed up build time
      Plugin.CustomOgImages(),
    ],
  },
}

export default config
