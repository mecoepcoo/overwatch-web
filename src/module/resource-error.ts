import { ResourceErrorInfo } from '../interface'
import { getXPath, wrapErrorInfo } from '../utils'

export const recordResourceErrorLog = (): void => {
  window.addEventListener('error', (e) => {
    const target = e.target || e.srcElement
    console.log(e)
    if (!target) return
    const isElementTarget = target instanceof HTMLScriptElement || target instanceof HTMLLinkElement || target instanceof HTMLImageElement
    if (!isElementTarget) return
    let url = ''
    if (target instanceof HTMLScriptElement || target instanceof HTMLImageElement) {
      url = target.src
    } else if (target instanceof HTMLLinkElement) {
      url = target.href
    } else {
      return
    }
    let data: ResourceErrorInfo = {
      errorType: 'resourceError',
      src: url,
      tagName: target.tagName,
      outerHTML: target.outerHTML,
      xPath: getXPath(target)
    }
    console.log(data)
    let errorInfo = wrapErrorInfo(data)
    console.log('看这里：', errorInfo)
  }, true)
}
