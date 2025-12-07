import { useContext } from "react"
import { ThemeProviderContext } from "./theme-context"
import type { ThemeProviderState } from "./theme-context"

export function useTheme() {
  const context = useContext(ThemeProviderContext) as ThemeProviderState

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }

  return context
}
