const puppeteer = require('puppeteer')
const open = require('open')
const fs = require('fs').promises
const express = require('express')
const cors = require('cors')
const path = require('path')
const uuid = require('uuid')

const PUBLIC_DIR = path.resolve(__dirname, 'public')

const PORT = 3000

const tasks = [
  async function typeSingleChar (page) {
    const textarea = '#textarea'
    await page.focus(textarea)
    await page.type(textarea, 'a')
  },
  async function typeMultiChars (page) {
    const textarea = '#textarea'
    await page.focus(textarea)
    await page.type(textarea, 'a'.repeat(10))
  }
]

const benchmark = async (url, task) => {
  const taskName = task.name
  const dist = path.join(
    'measurement',
    `${taskName !== 'anonymous' ? taskName : uuid()}.json`
  )

  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  const navigationPromise = page.waitForNavigation()
  await page.goto(url)
  await page.setViewport({ width: 1440, height: 810 })
  await navigationPromise

  await page.evaluate(async () => {
    await new Promise(resolve => window.requestIdleCallback(resolve, { timeout: 5000 }))
  })

  await page.tracing.start({ path: '/dev/null' })

  await task(page)

  await page.evaluate(async () => {
    await new Promise(resolve => window.requestIdleCallback(resolve, { timeout: 5000 }))
  })

  const buffer = await page.tracing.stop()
  const { traceEvents } = JSON.parse(buffer.toString())
  fs.writeFile(path.resolve(__dirname, 'public', dist), JSON.stringify(traceEvents))
  await browser.close()

  return dist
}

const main = async () => {
  const server = express()
  server.use(cors())
  server.use(express.static(PUBLIC_DIR))
  await new Promise(resolve => { server.listen(3000, resolve) })
  console.log(`Static file hosting on http://localhost:${PORT}`)
  const url = `http://localhost:${PORT}`

  const results = []

  for await (const task of tasks) {
    const dist = await benchmark(url, task)
    console.log(dist)
    results.push(encodeURIComponent(`${url}/${dist}`))
  }

  await open(`https://chromedevtools.github.io/timeline-viewer/?loadTimelineFromURL=${results.join(',')}`, { wait: true })
}

main()
