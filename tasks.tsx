import type { Task } from '@types'
import { pragma } from 'html-tsx'

export const tasks: Task[] = [
  {
    name: 'typeCharForEmptyTextArea',
    html: <textarea id="textarea" />,
    before: async page => {
      await page.waitForSelector('#textarea')
      await page.focus('#textarea')
    },
    main: async page => {
      await page.type('#textarea', 'a')
    },
    after: async () => {}
  },
  {
    name: 'typeCharForFilledTextArea',
    html: (
      <textarea id="textarea">
        {'a'.repeat(10 ** 5)}
      </textarea>
    ),
    before: async page => {
      await page.waitForSelector('#textarea')
      await page.focus('#textarea')
    },
    main: async page => {
      await page.type('#textarea', 'a')
    },
    after: async () => {}
  }
]
