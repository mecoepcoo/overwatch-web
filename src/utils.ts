import { UncaughtErrorInfo, HttpErrorInfo, ResourceErrorInfo, CustomErrorInfo, ReportInfo } from './interface'

/**
 * 获取XPath
 * @param element html元素
 */
export function getXPath(element: any): string {
  if (element.id !== '' && element.id !== undefined) { //判断id属性，如果这个元素有id，则显 示//*[@id="xPath"]  形式内容
    return '//*[@id="' + element.id + '"]'
  }
  //这里需要需要主要字符串转译问题，可参考js 动态生成html时字符串和变量转译（注意引号的作用）
  if (element == document.body) { //递归到body处，结束递归
    return '/html/' + element.tagName.toLowerCase()
  }
  let ix = 1 //在nodelist中的位置，且每次点击初始化
  let siblings = element.parentNode && element.parentNode.childNodes || [] //同级的子元素

  for (let i = 0, l = siblings.length; i < l; i++) {
    let sibling = siblings[i]
    //如果这个元素是siblings数组中的元素，则执行递归操作
    if (sibling == element) {
      return getXPath(element.parentNode) + '/' + element.tagName.toLowerCase() + '[' + (ix) + ']'
      //如果不符合，判断是否是element元素，并且是否是相同元素，如果是相同的就开始累加
    } else if (sibling.nodeType == 1 && (sibling as any).tagName == element.tagName) {
      ix++
    }
  }
  return ''
}

export function generateUUID(): string {
  let d = new Date().getTime()
  if (window.performance && typeof window.performance.now === 'function') {
      d += performance.now() //use high-precision timer if available
  }
  let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    let r = (d + Math.random() * 16) % 16 | 0
    d = Math.floor(d / 16)
    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16)
  })
  return uuid
}

type OriErrorInfo = UncaughtErrorInfo | HttpErrorInfo | ResourceErrorInfo | CustomErrorInfo

/**
 * 包装错误信息对象
 */
export function wrapErrorInfo(errorInfo: OriErrorInfo): ReportInfo {
  const id = generateUUID().replace(/-/g, '')
  const ua = window.navigator.userAgent
  const timestamp = new Date().getTime()
  const sourceUrl = window.location.href
  const title = document.title || ''

  let wrapInfo: ReportInfo = {
    id,
    ua,
    timestamp,
    url: sourceUrl,
    title,
    ...errorInfo
  }
  return wrapInfo
}
