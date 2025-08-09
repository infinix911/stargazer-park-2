/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_API: string
  // Note: DEV is already provided by Vite
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// Explicitly declare component modules
declare module './src/components/*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// Global type definitions for the gaming site
export interface GameItem {
  id: number
  title: string
  subtitle?: string
  image: string
  color: string
}

export interface CasinoItem {
  id: number
  title: string
  subtitle: string
  image: string
  color: string
}

export interface SlotItem {
  id: number
  title: string
  subtitle: string
  image: string
  color: string
}

// Event payloads
export type GameSelectedEvent = GameItem
export type CasinoSelectedEvent = CasinoItem
export type SlotSelectedEvent = SlotItem