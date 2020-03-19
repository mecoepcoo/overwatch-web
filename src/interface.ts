/**
 * 全局初始化配置
 */
export interface GlobalConfig {
  /** 上报id，用于区别应用，一般是appId */
  id?: string;
  /** 应用版本 */
  appVersion?: string;
  /** 环境、渠道 */
  releaseStage?: string;
  /** 上报url */
  reportUrl?: '';
  /** 其他自定义信息，将自动组装到错误对象中 */
  metaData?: Record<string, any>;
  /** 延迟多少毫秒，合并缓冲区中内容的上报 */
  delay?: number;
  /** 抽样率，0-1，为1时表示100%上报 */
  random?: number;
  /** 对于同一个错误重复上报的最高次数，0表示不限制 */
  repeat?: number;
  /** 本地存储的有效期（天） */
  localExp?: number;
  /** 语言，用于给不同端的数据分类 */
  language?: 'javascript';
  /** 回调函数，每当错误被上报，会执行回调函数 */
  callback?: Function;
  /** 是否在开发环境开启上报，开启后将根据url包含localhost或ip地址判断是否为开发环境 */
  devEnable?: boolean;
}

export interface UncaughtErrorInfo {
  errorType: string;
  url: string;
  message: string;
  line: number;
  col?: number;
  stack?: string;
  filePath?: string;
}

export interface HttpErrorInfo {
  errorType: 'httpError';
  url: string;
  status: number;
  statusText: string;
  loadTime: number;
  response?: string;
}

export interface ResourceErrorInfo {
  errorType: 'resourceError';
  src: string;
  tagName: string;
  outerHTML: string;
  xPath: string;
}

export interface CustomErrorInfo {
  errorType: string;
  url: string;
  customInfo: {
    [propName: string]: any;
  };
}

/* 信息这块内容仅提供结构参考，没有实际用途 */
/**
 * 基本错误信息
 */
export interface BaseErrorInfo {
  /** 时间戳（毫秒） */
  timestamp?: number;
  /** 错误类型，可用errorName，也可以自定义类型 */
  errorType?: string;
  /** 发生错误页面的标题 */
  title?: string;
  /** 地址 */
  url?: string;
}

export interface ExtendInfo {
  id: string;
  ua: string;
  timestamp: number;
  url: string;
  title: string;
  [propName: string]: any;
}

export type ReportInfo = ExtendInfo & UncaughtErrorInfo | HttpErrorInfo | ResourceErrorInfo | CustomErrorInfo

/**
 * 设备信息
 */
export interface DeviceInfo {
  /** 浏览器 */
  browser?: string;
  /** 浏览器版本 */
  browserVersion?: string;
  /** 操作系统 */
  os?: string;
  /** 操作系统版本 */
  osVersion?: string;
  /** 设备名，例如：huawei，xiaomi */
  deviceName?: string;
  /** 设备型号 */
  model?: string;
  /** js引擎 */
  engine?: string;
  /** 引擎版本 */
  engineVersion?: string;
}

/* 信息这块内容仅提供结构参考，没有实际用途 */
/**
 * 代码错误信息
 */
export interface CodeErrorInfo {
  /** 堆栈详细错误信息 */
  stacktrace?: string;
  /** 错误信息 */
  detail: {
    /** 错误名称 */
    name?: string;
    /** 报错信息 */
    msg?: string;
    /** 报错文件路径 */
    file?: string;
    /** 报错行号 */
    line?: number;
    /** 报错列号 */
    column?: number;
  };
}

/* 信息这块内容仅提供结构参考，没有实际用途 */
/**
 * 请求错误信息
 */
export interface HttpErrorInfoDemo {
  request: {
    /** 请求方法 */
    method?: string;
    /** 请求地址 */
    url?: string;
    /** 请求参数, 转为JSON string */
    params?: string;
    /** 请求头 */
    headers?: Record<string, any>;
  };
  response: {
    /** 状态码 */
    status?: number;
    /** 响应 */
    response?: any;
    /** 响应时间（毫秒） */
    elapsedTime?: number;
  };
}
