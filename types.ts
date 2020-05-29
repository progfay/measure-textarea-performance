import type { Page } from 'puppeteer'

export interface Task {
  name?: string
  html: string
  before?: (page: Page) => Promise<void>
  main: (page: Page) => Promise<void>
  after?: (page: Page) => Promise<void>
}
