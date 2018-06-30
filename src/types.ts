'use strict'

export type StorageType = 'localStorage' | 'sessionStorage'

export interface GetItemSpan {
  type: 'getItem'
  timestamp: number
  key: string
}

export interface SetItemSpan {
  type: 'setItem'
  timestamp: number
  key: string
  value: string | null
}

export interface RemoveItemSpan {
  type: 'removeItem'
  timestamp: number
  key: string
}

export interface ClearSpan {
  type: 'clear'
  timestamp: number
}

export type Span = GetItemSpan | SetItemSpan | RemoveItemSpan | ClearSpan

export interface StorageTracing {
  initialState: string[][]
  spans: Span[]
}

export interface WindowTracing {
  localStorage: StorageTracing
  sessionStorage: StorageTracing
}

export interface Trace {
  initialState: () => Promise<string[][]>
  spans: () => Promise<Span[]>
  state: () => Promise<string[][]>
}

declare global {
  interface Window {
    tracing: WindowTracing
  }
}
