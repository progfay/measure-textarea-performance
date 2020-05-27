const puppeteer = require('puppeteer')
const open = require('open')
const fs = require('fs').promises
const express = require('express')
const cors = require('cors')

const PUBLIC_DIR = require('path').resolve(__dirname, 'public')

const PORT = 3000

const main = async () => {
  const server = express()
  server.use(cors())
  server.use(express.static(PUBLIC_DIR))
  await new Promise(resolve => { server.listen(3000, resolve) })
  console.log(`Static file hosting on http://localhost:${PORT}`)
  const url = `http://localhost:${PORT}`

  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  const navigationPromise = page.waitForNavigation()
  await page.goto(url)
  await page.setViewport({ width: 1440, height: 810 })

  await navigationPromise
  const textarea = '#textarea'
  await page.waitForSelector(textarea)
  await page.tracing.start({ path: '/dev/null' })
  await page.focus(textarea)
  await page.type(textarea, 'a'.repeat(3))
  const buffer = await page.tracing.stop()
  const { traceEvents } = JSON.parse(buffer.toString())
  fs.writeFile('./public/measurement/typeMultiChars.json', JSON.stringify(traceEvents))

  await browser.close()

  await open(`https://chromedevtools.github.io/timeline-viewer/?loadTimelineFromURL=${encodeURIComponent(`${url}/typeMultiChars.json`)}`, { wait: true })
}

main()
