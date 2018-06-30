'use strict'

import * as net from 'net'
import * as http from 'http'
import * as assert from 'assert'
import * as puppeteer from 'puppeteer'
import * as lib from './'

function fixture(type: lib.StorageType) {
  let storage = window[type]
  storage.setItem('a', 'b')
  storage.getItem('a')
  storage.clear()
  storage.setItem('c', 'd')
  storage.setItem('e', 'f')
  storage.removeItem('c')
}

async function test(type: lib.StorageType): Promise<void> {
  let html = String.raw
  let index = html`
    <script>
      ${fixture.toString()}
      ${fixture.name}('${type}')
    </script>
  `

  let server = http.createServer((_, res) => res.end(index))
  await new Promise(resolve => server.listen(0, resolve))
  let address = server.address() as net.AddressInfo

  let browser = await puppeteer.launch()
  let page = await browser.newPage()
  let trace = await lib.newStorageTrace(page, type)

  try {
    await page.goto(`http://localhost:${address.port}/`)

    let initialState = await trace.initialState()
    assert.deepStrictEqual(initialState, [])

    let spans = await trace.spans()
    assert.deepStrictEqual(spans.length, 6)

    let state = await trace.state()
    assert.deepStrictEqual(state, [['e', 'f']])
  } finally {
    browser.close()
    server.close()
  }
}

test('localStorage')
test('sessionStorage')
