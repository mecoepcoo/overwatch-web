import { UncaughtErrorInfo } from '../interface'
import { wrapErrorInfo } from '../utils'
import { sendReport } from '../report'

export const recordWindowErrorLog = (): void => {
  (window as any).onerror = (message: string, url: string, line: number, col: number, error: Error): void => {
    if (!error) return
    if (message !== 'Script error.' && !url) {
      return
    }
    setTimeout(() => {
      // 有些浏览器不支持col
      let colno = col || 0
      let stackInfo = '未能获取堆栈信息'
      if (error.stack) {
        stackInfo = error.stack.toString()
      }
      let data: UncaughtErrorInfo = {
        errorType: error.name,
        url,
        message,
        line,
        col: colno,
        stack: stackInfo
      }
      console.log(data)
      let errorInfo = wrapErrorInfo(data)
      sendReport(errorInfo)
      console.log(errorInfo)
    }, 0)
    // let errorName = error.name
  }
}

/* 监听未处理的promise reject */
export const recordUnhandledRejectionLog = (): void => {
  window.addEventListener('unhandledrejection', e => {
    console.log(e)
    let data: UncaughtErrorInfo = {
      errorType: e.type,
      url: window.location.href,
      message: e.reason,
      line: 0,
      col: 0,
      stack: '',
    }
    console.log(data)
  })
}
