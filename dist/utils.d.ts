import { UncaughtErrorInfo, HttpErrorInfo, ResourceErrorInfo, CustomErrorInfo, ReportInfo } from './interface';
/**
 * 获取XPath
 * @param element html元素
 */
export declare function getXPath(element: HTMLElement): string;
export declare function generateUUID(): string;
declare type OriErrorInfo = UncaughtErrorInfo | HttpErrorInfo | ResourceErrorInfo | CustomErrorInfo;
/**
 * 包装错误信息对象
 */
export declare function wrapErrorInfo(errorInfo: OriErrorInfo): ReportInfo;
export {};
