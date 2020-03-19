import { HttpErrorInfo } from '../interface'
import { wrapErrorInfo } from '../utils'

function rewiredXhr(): void {
  function ajaxEventTrigger(event: string): void {
    // @ts-ignore
    const ajaxEvent = new CustomEvent(event, { detail: this })
    window.dispatchEvent(ajaxEvent)
  }

  const oldXhr = window.XMLHttpRequest

  function newXhr(): XMLHttpRequest {
    const realXhr = new oldXhr()
    realXhr.addEventListener('loadstart', function () { ajaxEventTrigger.call(this, 'ajaxLoadStart') }, false)
    realXhr.addEventListener('loadend', function () { ajaxEventTrigger.call(this, 'ajaxLoadEnd') }, false)
    return realXhr
  }

  const timeRecordArray: any[] = []
  window.XMLHttpRequest = (newXhr as any)
  window.addEventListener('ajaxLoadStart', function (e) {
    const tempObj = {
      timestamp: new Date().getTime(),
      event: e
    }
    timeRecordArray.push(tempObj)
  })
  window.addEventListener('ajaxLoadEnd', function () {
    setTimeout(() => {
      for (const i in timeRecordArray) {
        const detail = timeRecordArray[i].event.detail
        if (detail.status >= 200 && detail.status < 400 || detail.status <= 0) return
        const currentTime = new Date().getTime()
        const url = detail.responseURL
        const status = detail.status
        const statusText = detail.statusText
        const loadTime = currentTime - timeRecordArray[i].timestamp
        let response = ''
        try {
          response = JSON.stringify(detail.response)
        } catch (err) {
          response = ''
        }
        let data: HttpErrorInfo = {
          errorType: 'httpError',
          url,
          status,
          statusText,
          loadTime,
          response
        }
        timeRecordArray.splice(+i, 1)
        let errorInfo = wrapErrorInfo(data)
        console.log('看这里：', errorInfo)
      }
    }, 0)
  })
}

export const recordHttpLog = (): void => {
  // 只监听非200错误，忽略超时等情况，不考虑fetch请求
  rewiredXhr()
}
