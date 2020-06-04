import path from 'path'
import fs from 'fs/promises'
import puppeteer from 'puppeteer'
import { v4 as uuid } from 'uuid'

import type { Task } from '@types'

export const benchmark = async (url: string, task: Task) => {
  const distDir = `${task.name || 'anonymous'}-${uuid()}`

  await fs.mkdir(path.resolve('public', distDir))
  await fs.writeFile(
    path.resolve('public', distDir, 'index.html'),
    task.html
  )

  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  const navigationPromise = page.waitForNavigation()
  await page.goto(`${url}/${path.join(distDir, 'index.html')}`)
  await page.setViewport({ width: 1440, height: 810 })
  await navigationPromise

  await task.before?.(page)

  await page.evaluate(async () => {
    await Promise.all([
      new Promise(resolve => (window as any)
        .requestIdleCallback(resolve)),
      new Promise(resolve => (window as any)
        .requestAnimationFrame(resolve))
    ])
  })

  await page.tracing.start({ path: '/dev/null', screenshots: true })

  console.time(distDir)

  await task.main?.(page)

  await page.evaluate(async () => {
    await Promise.all([
      new Promise(resolve => (window as any)
        .requestIdleCallback(resolve)),
      new Promise(resolve => (window as any)
        .requestAnimationFrame(resolve))
    ])
  })

  console.timeEnd(distDir)

  const buffer = await page.tracing.stop()

  await task.after?.(page)

  const { traceEvents } = JSON.parse(buffer.toString())

  await Promise.all([
    browser.close(),
    fs.writeFile(
      path.resolve('public', distDir, 'trace.json'),
      JSON.stringify(traceEvents)
    )
  ])

  return path.join(distDir, 'trace.json')
}
