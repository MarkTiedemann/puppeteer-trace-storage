# puppeteer-trace-storage

**Trace [`localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) and [`sessionStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage) in [`puppeteer`](https://github.com/GoogleChrome/puppeteer).**

## Quickstart

```js
const puppeteer = require('puppeteer')
const { newStorageTrace } = require('puppeteer-trace-storage')

!(async () => {
  let browser = await puppeteer.launch()
  let page = await browser.newPage()
  let trace = await newStorageTrace(page, 'localStorage')
  await page.goto('https://stackoverflow.com')
  let spans = await trace.spans()
  console.log(spans)
  /*
  [ { type: 'getItem',
      timestamp: 1530403977783,
      key: 'se:fkey' },
    { type: 'setItem',
      timestamp: 1530403977783,
      key: 'se:fkey',
      value: '1530403979' },
    { type: 'removeItem',
      timestamp: 1530403977841,
      key: 'gps-probe' } ]
  */
  await browser.close()
})()
```

## Development

- **`yarn install`**: Install the dependencies
- **`yarn format`**: Format the code
- **`yarn build`**: Build the code
- **`yarn clean`**: Clean the code

## License

MIT
