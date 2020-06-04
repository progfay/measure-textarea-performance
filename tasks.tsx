import type { Task } from '@types'
import { pragma } from 'html-tsx'

export const tasks: Task[] = [
  {
    name: 'addCharWithTyping',
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
  },
  {
    name: 'addCharWithAdditionAssignment',
    html: (
      <textarea id="textarea">
        {'a'.repeat(10 ** 5)}
      </textarea>
    ),
    before: async page => {
      await page.waitForSelector('#textarea')
    },
    main: async page => {
      await page.evaluate(async () => {
        const textarea = document.getElementById('textarea')
        if (!textarea) return
        textarea.style.display = 'none'
        await new Promise(requestAnimationFrame)
        textarea.innerHTML += 'a'
        await new Promise(requestAnimationFrame)
        textarea.style.display = 'block'
        await new Promise(requestAnimationFrame)
      })
    },
    after: async () => {}
  }
]
