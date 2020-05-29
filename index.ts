import path from 'path'
import express from 'express'
import cors from 'cors'
import open from 'open'
import { benchmark } from './lib/benchmark'
import { tasks } from './tasks'

const PUBLIC_DIR = path.resolve('public')
const PORT = 3000

const main = async () => {
  const server = express()
  server.use(cors({
    origin: 'https://chromedevtools.github.io'
  }))
  server.use(express.static(PUBLIC_DIR))
  await new Promise(resolve => { server.listen(3000, resolve) })
  console.log(`Static file hosting on http://localhost:${PORT}`)
  const url = `http://localhost:${PORT}`

  const results = []

  for await (const task of tasks) {
    const dist = await benchmark(url, task)
    results.push(encodeURIComponent(`${url}/${dist}`))
  }

  await open(`https://chromedevtools.github.io/timeline-viewer/?loadTimelineFromURL=${results.join(',')}`, { wait: true })
}

main().catch(console.error)
