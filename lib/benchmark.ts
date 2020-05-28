import path from 'path'
import fs from 'fs/promises'
import puppeteer from 'puppeteer'
import { v4 as uuid } from 'uuid'

import type { Task } from '@types'

export const benchmark = async (url: string, task: Task) => {
  const dist = path.join('measurement', `${task.name || uuid()}.json`)

  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  const navigationPromise = page.waitForNavigation()
  await page.goto(url)
  await page.setViewport({ width: 1440, height: 810 })
  await navigationPromise

  await task.before?.(page)

  await page.evaluate(async () => {
    await new Promise(resolve => (window as any)
      .requestIdleCallback(resolve, { timeout: 5000 }))
  })

  await page.tracing.start({ path: '/dev/null' })

  console.time(dist)

  await task.main?.(page)

  console.timeEnd(dist)

  await page.evaluate(async () => {
    await new Promise(resolve => (window as any)
      .requestIdleCallback(resolve, { timeout: 5000 }))
  })

  const buffer = await page.tracing.stop()

  await task.after?.(page)

  const { traceEvents } = JSON.parse(buffer.toString())
  const file = path.resolve('public', dist)
  await fs.writeFile(file, JSON.stringify(traceEvents)
  )
  await browser.close()

  return dist
}
