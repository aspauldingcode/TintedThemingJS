import { Base16Theme } from '../base16.js'
import type { Base16ThemeData } from '../types.js'
import darkData from './dark.json'
import lightData from './light.json'

/**
 * Default dark theme (no network required)
 */
export const defaultDark = new Base16Theme(darkData as Base16ThemeData)

/**
 * Default light theme (no network required)
 */
export const defaultLight = new Base16Theme(lightData as Base16ThemeData)
