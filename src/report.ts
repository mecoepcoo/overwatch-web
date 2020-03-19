import { ReportInfo } from './interface'
import Config from './global'

export function sendReport(reportInfo: ReportInfo) {
  let img = new Image()
  img.src = (Config.get('reportUrl') as string)
}