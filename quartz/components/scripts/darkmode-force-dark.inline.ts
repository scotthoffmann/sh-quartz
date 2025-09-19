const forcedTheme = "dark" as const

const emitForcedThemeChangeEvent = (theme: typeof forcedTheme) => {
  const event: CustomEventMap["themechange"] = new CustomEvent("themechange", {
    detail: { theme },
  })
  document.dispatchEvent(event)
}

const applyTheme = () => {
  document.documentElement.setAttribute("saved-theme", forcedTheme)
  localStorage.setItem("theme", forcedTheme)
  emitForcedThemeChangeEvent(forcedTheme)
}

applyTheme()

document.addEventListener("nav", () => {
  applyTheme()
})
