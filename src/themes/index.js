import themeDefault from './default.js'
import themeTechBlue from './tech-blue.js'
import themeLiterary from './literary.js'
import themeDark from './dark.js'
import themeGreenForest from './green-forest.js'

export const THEMES = [
  themeDefault,
  themeTechBlue,
  themeLiterary,
  themeDark,
  themeGreenForest,
]

export function getThemeById(id) {
  return THEMES.find(t => t.id === id) ?? themeDefault
}
