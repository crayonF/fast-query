import child_process from 'child_process'
import chalk from 'chalk'
import {
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
} from './utils.js'

export default {
  url: 'https://www.baidu.com/',
  keywords: '',

  async onList () {
    const webs = await getInternalWebs()
    const webNames = Object.keys(webs)
    const length = Math.max(...webNames.map(name => name.length)) + 3

    const message = webNames.map(name => {
      const webUrl = webs[name]
      return '  ' + chalk.green(name) + geneDashLine(name, length) + chalk.green(webUrl['url'])
    })
    for (const item of message) {
      console.log(item)
    }
  },
  async onAdd (name, url) {
    const webs = await getInternalWebs()
    const webNames = Object.keys(webs)
    const webUrls = webNames.map(name => webs[name]['url'])
    if (webNames.includes(name) || webUrls.some(eachUrl => isLowerCaseEqual(eachUrl, url))) {
      printError('name 或 url 已存在')
    }
    const customWebs = await readFile(FQRC)
    const newCustomWebs = Object.assign(customWebs, { 
      [name]: { url } 
    })
    await writeFile(FQRC, newCustomWebs)
    printSuccess(`添加 '${name}' 成功，使用 fq ${name} 打开网页`)
  },
  async onDelete (name) {
    if (await isNameNotFound(name) || await isInternalName(name)) {
      return
    }
    const webs = await getInternalWebs()
    delete webs[name]
    await writeFile(FQRC, webs)
    printSuccess(`删除 '${name}' 成功`)
  },
  async onOpen (type, params) {
    if (JSON.stringify(type) === '{}') {
      const webs = await getInternalWebs()
      const webNames = Object.keys(webs)
      if (params.length && webNames.includes(params[0])) {
        let webName = params[0]
        this.openWebDirect(webs[webName]['url'])
      } else {
        const keywords = handleKeywords(params)
        this.goBaidu(keywords)
      }
    } else {
      this.queryInWeb(type, params)
    }
  },
  openWebDirect (web) {
    this.url = web
    this.keywords = ''
    this.openBrowser()
  },
  queryInWeb (web, wds) {
    const keywords = handleKeywords(wds)
    if (web.Baidu !== undefined) {
      this.goBaidu(keywords)
    } else if (web.github !== undefined) {
      this.goGithub(keywords)
    } else if (web.google !== undefined) {
      this.goGoogle(keywords)
    }
  },
  goBaidu (wd) {
    this.url = "https://www.baidu.com/"
    this.keywords = wd ? `s?wd=${wd}` : ''
    this.openBrowser()
  },
  goGithub (wd) {
    this.url = 'https://github.com/'
    this.keywords = wd ? `search?q=${wd}` : ''
    this.openBrowser()
  },
  goGoogle (wd) {
    this.url = "https://www.google.com/"
    this.keywords = wd ? `search?q=${wd}` : ''
    this.openBrowser()
  },
  openBrowser () {
    child_process.exec(`start ${this.url}${this.keywords}`)
  }
}