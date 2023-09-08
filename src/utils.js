import fs from 'fs'
import ini from 'ini'
import path from 'path'
import chalk from 'chalk'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const WEBS = require('./webs.json')

const FQRC = path.join(process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'], '.fqrc')

async function readFile(file) {
  return new Promise(resolve => {
    if (!fs.existsSync(file)) {
      resolve({})
    } else {
      try {
        const content = ini.parse(fs.readFileSync(file, 'utf-8'))
        resolve(content)
      } catch (error) {
        printError(error)
      }
    }
  })
}

async function writeFile(path, content) {
  return new Promise(resolve => {
    try {
      fs.writeFileSync(path, ini.stringify(content))
      resolve()
    } catch (error) {
      printError(error)
    }
  })
}

// 获取所有已配置地址
async function getInternalWebs () {
  const customWebs = await readFile(FQRC)
  return Object.assign({}, WEBS, customWebs)
}

function handleKeywords (wds) {
  let keyword = ''
  if (wds.length > 1) {
    keyword = wds.join('%20')
  } else if (wds[0] && wds[0].split(' ').length > 1) {
    keyword = wds[0].split(' ').join('%20')
  } else {
    keyword = wds[0]
  }
  return keyword
}

function padding(message = '', before = 1, after = 1) {
  return new Array(before).fill(' ').join('') + message + new Array(after).fill(' ').join('')
}

function printSuccess(message) {
  console.log(chalk.bgGreenBright(padding('SUCCESS')) + ' ' + message)
  process.exit(0)
}

function printError(error) {
  console.error(chalk.bgRed(padding('ERROR')) + ' ' + chalk.red(error))
  process.exit(1)
}

function geneDashLine(message, length) {
  const finalMessage = new Array(Math.max(2, length - message.length + 2)).join('-')
  return padding(chalk.cyan(finalMessage))
}

function isLowerCaseEqual(str1, str2) {
  if (str1 && str2) {
    return str1.toLowerCase() === str2.toLowerCase()
  } else {
    return !str1 && !str2
  }
}

async function isNameNotFound (name) {
  const webs = await getInternalWebs()
  if (!Object.keys(webs).includes(name)) {
    printError(`name 不存在`)
    return true
  }
  return false
}

async function isInternalName (name) {
  if (Object.keys(WEBS).includes(name)) {
    printError(`不可删除或修改内置地址`)
    return true
  }
  return false
}
export {
  FQRC,
  readFile,
  writeFile,
  getInternalWebs,
  handleKeywords,
  isLowerCaseEqual,
  isNameNotFound,
  isInternalName,
  printError,
  printSuccess,
  geneDashLine
}