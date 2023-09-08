#!/usr/bin/env node
import chalk from 'chalk'
import { program } from 'commander'
import fq from '../src/index.js'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const packageJson = require('../package.json')
program
  .version(chalk.green(packageJson.version), '-v, --version')

program
  .command('ls')
  .description(chalk.blue('列出所有已添加网页'))
  .action(fq.onList);

program
  .command('add <name> <url>')
  .description(chalk.blue('添加快捷网页'))
  .action(fq.onAdd)

program
  .command('del <name>')
  .description(chalk.blue('删除快捷网页'))
  .action(fq.onDelete)

program
  .command('edit <name> <url>')
  .description(chalk.blue('修改快捷网页'))
  .action(fq.onEdit)

program
  .description(chalk.blue('快速在浏览器打开网页并支持在搜索引擎中搜索'))
  .option('-g, --github', '打开github')
  .option('-b, --baidu', '打开百度搜索')
  .option('-G, --google', '打开谷歌搜索')
  .action((Option, { args }) => {
    fq.onOpen(Option, args)
  })

// 命令帮助说明
program.on('--help', () => {
  console.info('命令列表:')
  console.info('    fq [name]       ', chalk.blue('  打开已添加的网页'))
  console.info('    fq [question]   ', chalk.blue('  打开百度搜索'))
  console.info('    fq [question] -g', chalk.blue('  打开github搜索'))
  console.info('    fq [question] -G', chalk.blue('  打开谷歌搜索'))
})

program.parse(process.argv)