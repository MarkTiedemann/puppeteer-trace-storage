'use strict'

import * as puppeteer from 'puppeteer'
import * as types from './types'
export * from './types'

export async function newStorageTrace(
  page: puppeteer.Page,
  type: types.StorageType
): Promise<types.Trace> {
  await page.evaluateOnNewDocument(initLocalStorageTrace, type)
  return {
    initialState: () =>
      selectObject(page, type => window.tracing[type].initialState, type),
    spans: () => selectObject(page, type => window.tracing[type].spans, type),
    state: () => selectObject(page, type => Object.entries(window[type]), type)
  }
}

async function selectObject<P, R>(
  page: puppeteer.Page,
  func: (p: P) => R,
  param: P
): Promise<R> {
  return JSON.parse(
    await page.evaluate(
      (func, param) => JSON.stringify(eval(func)(param)),
      func.toString(),
      param
    )
  )
}

function initLocalStorageTrace(type: types.StorageType): void {
  if (!window.tracing) {
    window.tracing = {} as types.WindowTracing
  }

  if (!window.tracing[type]) {
    window.tracing[type] = {
      initialState: Object.entries(window[type]),
      spans: []
    }

    let storage = window[type]
    let spans = window.tracing[type].spans

    let getItem = storage.getItem
    let setItem = storage.setItem
    let removeItem = storage.removeItem
    let clear = storage.clear

    Object.defineProperty(window[type], 'getItem', {
      get: () => (key: string): string | null => {
        spans.push({ type: 'getItem', timestamp: Date.now(), key })
        return getItem.call(storage, key)
      }
    })

    Object.defineProperty(window[type], 'setItem', {
      get: () => (key: string, value: string) => {
        spans.push({ type: 'setItem', timestamp: Date.now(), key, value })
        setItem.call(storage, key, value)
      }
    })

    Object.defineProperty(window[type], 'removeItem', {
      get: () => (key: string) => {
        spans.push({ type: 'removeItem', timestamp: Date.now(), key })
        removeItem.call(storage, key)
      }
    })

    Object.defineProperty(window[type], 'clear', {
      get: () => () => {
        spans.push({ type: 'clear', timestamp: Date.now() })
        clear.call(storage)
      }
    })
  }
}
