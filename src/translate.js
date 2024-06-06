import axios from "axios"
import chalk from 'chalk'

const params = {
  num: 5,
  ver: '3.0',
  doctype: 'json',
  cache: false,
  le: 'en'
}

export const onTranslate = async (words) => {
  if (!words.length) return
  params.q = words.join('+')
  const { data: res } = await axios.get('https://dict.youdao.com/suggest', { params })
  const { entries } = res.data
  const message = entries.map(item => {
    const entry = item.entry
    const explain = item.explain
    return `   ${chalk.cyanBright(entry)}: ${chalk.cyanBright(explain)}`
  })
  for (const item of message) {
    console.log(item)
  }
}
