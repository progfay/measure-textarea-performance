import type { Task } from '@types'

export const tasks: Task[] = [
  {
    name: 'typeSingleChar',
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
