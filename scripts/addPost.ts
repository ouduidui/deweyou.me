import fs from 'fs'
import inquirer from 'inquirer'
import type { Color } from 'chalk'
import chalk from 'chalk'
import { getPostList } from '../utils/article'

// eslint-disable-next-line no-console
const log = (msg: string, color: Color = 'green') => console.log(chalk[color](msg))

const format = (str: string) => str.replace(/\B([A-Z])/g, '-$1').split(' ').join('-').toLowerCase()

interface AnsType {
  id: string
  title: string
  description: string
  author: string
}

(async () => {
  const lists = getPostList().map(p => p.id)
  const ans = await inquirer.prompt<AnsType>([
    {
      type: 'input',
      name: 'id',
      message: 'please enter the post id:',
      validate: (input) => {
        if (lists.includes(input))
          return 'The same topic id already exists'
        else
          return true
      },
    },
    {
      type: 'input',
      name: 'title',
      message: 'please enter the post title:',
    },
    {
      type: 'input',
      name: 'description',
      message: 'please enter the post description:',
    },
    {
      type: 'input',
      name: 'author',
      message: 'please enter the post author:',
      default: 'Dewey Ou',
    },
  ]).catch((err) => {
    log(err.message, 'red')
    process.exit(1)
  })

  log('start generate post file...')

  const { id, title, description, author } = ans
  const localId = format(id)

  const md = `---
title: ${title}
description: ${description}
date: ${new Date().toString()}
author: ${author}
---

[[toc]]

## Start

HelloWorld
`

  fs.writeFileSync(`contents/posts/${localId}.md`, md)

  log('generate success!')
})()
