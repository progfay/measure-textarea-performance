import type { Task } from '@types'
import { pragma } from 'html-tsx'

export const tasks: Task[] = [
  {
    name: 'typeSingleChar',
    html: <textarea id="textarea" />,
    before: async page => {
      await page.waitForSelector('#textarea')
    },
    main: async page => {
      const textarea = '#textarea'
      await page.focus(textarea)
      await page.type(textarea, 'a')
    },
    after: async () => {}
  },
  {
    name: 'typeMultiChars',
    html: <textarea id="textarea" />,
    before: async page => {
      await page.waitForSelector('#textarea')
    },
    main: async page => {
      const textarea = '#textarea'
      await page.focus(textarea)
      await page.type(textarea, 'a'.repeat(10))
    },
    after: async () => {}
  }
]
