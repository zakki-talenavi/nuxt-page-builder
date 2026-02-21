import type { Config } from './config'

/** Minimal store interface used by the reducer (framework-agnostic). */
export interface PuckStoreLike {
  config: Config
}
