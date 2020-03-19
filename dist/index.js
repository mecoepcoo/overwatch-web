/**
 * overwatch-web v0.0.1
 * (c) 2020 Tianzhen mecoepcoo@vip.qq.com
 * @license MIT
 */
/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

/**
 * 获取XPath
 * @param element html元素
 */
function getXPath(element) {
    if (element.id !== '' && element.id !== undefined) { //判断id属性，如果这个元素有id，则显 示//*[@id="xPath"]  形式内容
        return '//*[@id="' + element.id + '"]';
    }
    //这里需要需要主要字符串转译问题，可参考js 动态生成html时字符串和变量转译（注意引号的作用）
    if (element == document.body) { //递归到body处，结束递归
        return '/html/' + element.tagName.toLowerCase();
    }
    var ix = 1, //在nodelist中的位置，且每次点击初始化
    siblings = element.parentNode && element.parentNode.childNodes || []; //同级的子元素
    for (var i = 0, l = siblings.length; i < l; i++) {
        var sibling = siblings[i];
        //如果这个元素是siblings数组中的元素，则执行递归操作
        if (sibling == element) {
            // TODO: 严格模式不能用callee，要改
            return arguments.callee(element.parentNode) + '/' + element.tagName.toLowerCase() + '[' + (ix) + ']';
            //如果不符合，判断是否是element元素，并且是否是相同元素，如果是相同的就开始累加
        }
        else if (sibling.nodeType == 1 && sibling.tagName == element.tagName) {
            ix++;
        }
    }
    return '';
}
function generateUUID() {
    var d = new Date().getTime();
    if (window.performance && typeof window.performance.now === 'function') {
        d += performance.now(); //use high-precision timer if available
    }
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}
/**
 * 包装错误信息对象
 */
function wrapErrorInfo(errorInfo) {
    var id = generateUUID().replace(/-/g, '');
    var ua = window.navigator.userAgent;
    var timestamp = new Date().getTime();
    var sourceUrl = window.location.href;
    var title = document.title || '';
    var wrapInfo = __assign({ id: id,
        ua: ua,
        timestamp: timestamp, url: sourceUrl, title: title }, errorInfo);
    return wrapInfo;
}

var DEFAULT_DELAY = 0;
var DEFAULT_RANDOM = 1;
var DEFAULT_REPEAT = 0;
var DEFAULT_LOCAL_EXP = 10;
var DEFAULT_LANGUAGE = 'javascript';
var DEFAULT_DEV_ENABLE = false;
var globalConfig = {
    delay: DEFAULT_DELAY,
    random: DEFAULT_RANDOM,
    repeat: DEFAULT_REPEAT,
    localExp: DEFAULT_LOCAL_EXP,
    language: DEFAULT_LANGUAGE,
    devEnable: DEFAULT_DEV_ENABLE,
    callback: function () { }
};
var Config = {
    set: function (configObj) {
        // TODO: 这里应该做一些参数验证
        Object.assign(globalConfig, configObj);
        return true;
    },
    get: function (configKey) {
        return globalConfig[configKey] || null;
    }
};
//# sourceMappingURL=global.js.map

function sendReport(reportInfo) {
    var img = new Image();
    img.src = Config.get('reportUrl');
}
//# sourceMappingURL=report.js.map

var recordWindowErrorLog = function () {
    window.onerror = function (message, url, line, col, error) {
        if (!error)
            return;
        if (message !== 'Script error.' && !url) {
            return;
        }
        setTimeout(function () {
            // 有些浏览器不支持col
            var colno = col || 0;
            var stackInfo = '未能获取堆栈信息';
            if (error.stack) {
                stackInfo = error.stack.toString();
            }
            var data = {
                errorType: error.name,
                url: url,
                message: message,
                line: line,
                col: colno,
                stack: stackInfo
            };
            console.log(data);
            var errorInfo = wrapErrorInfo(data);
            sendReport();
            console.log(errorInfo);
        }, 0);
        // let errorName = error.name
    };
};
/* 监听未处理的promise reject */
var recordUnhandledRejectionLog = function () {
    window.addEventListener('unhandledrejection', function (e) {
        console.log(e);
        var data = {
            errorType: e.type,
            url: window.location.href,
            message: e.reason,
            line: 0,
            col: 0,
            stack: '',
        };
        console.log(data);
    });
};

function rewiredXhr() {
    function ajaxEventTrigger(event) {
        // @ts-ignore
        var ajaxEvent = new CustomEvent(event, { detail: this });
        window.dispatchEvent(ajaxEvent);
    }
    var oldXhr = window.XMLHttpRequest;
    function newXhr() {
        var realXhr = new oldXhr();
        realXhr.addEventListener('loadstart', function () { ajaxEventTrigger.call(this, 'ajaxLoadStart'); }, false);
        realXhr.addEventListener('loadend', function () { ajaxEventTrigger.call(this, 'ajaxLoadEnd'); }, false);
        return realXhr;
    }
    var timeRecordArray = [];
    window.XMLHttpRequest = newXhr;
    window.addEventListener('ajaxLoadStart', function (e) {
        var tempObj = {
            timestamp: new Date().getTime(),
            event: e
        };
        timeRecordArray.push(tempObj);
    });
    window.addEventListener('ajaxLoadEnd', function () {
        setTimeout(function () {
            for (var i in timeRecordArray) {
                var detail = timeRecordArray[i].event.detail;
                if (detail.status >= 200 && detail.status < 400 || detail.status <= 0)
                    return;
                var currentTime = new Date().getTime();
                var url = detail.responseURL;
                var status_1 = detail.status;
                var statusText = detail.statusText;
                var loadTime = currentTime - timeRecordArray[i].timestamp;
                var response = '';
                try {
                    response = JSON.stringify(detail.response);
                }
                catch (err) {
                    response = '';
                }
                var data = {
                    errorType: 'httpError',
                    url: url,
                    status: status_1,
                    statusText: statusText,
                    loadTime: loadTime,
                    response: response
                };
                timeRecordArray.splice(+i, 1);
                var errorInfo = wrapErrorInfo(data);
                console.log('看这里：', errorInfo);
            }
        }, 0);
    });
}
var recordHttpLog = function () {
    // 只监听非200错误，忽略超时等情况，不考虑fetch请求
    rewiredXhr();
};

var recordResourceErrorLog = function () {
    window.addEventListener('error', function (e) {
        console.dir(e.target);
        var target = e.target || e.srcElement;
        if (!target)
            return;
        var isElementTarget = target instanceof HTMLScriptElement || target instanceof HTMLLinkElement || target instanceof HTMLImageElement;
        if (!isElementTarget)
            return;
        var url = '';
        if (target instanceof HTMLScriptElement || target instanceof HTMLImageElement) {
            url = target.src;
        }
        else if (target instanceof HTMLLinkElement) {
            url = target.href;
        }
        else {
            return;
        }
        var data = {
            errorType: 'resourceError',
            src: url,
            tagName: target.tagName,
            outerHTML: target.outerHTML,
            xPath: getXPath(target)
        };
        console.log(data);
        var errorInfo = wrapErrorInfo(data);
        console.log('看这里：', errorInfo);
    }, true);
};

function initConfig(globalConfig) {
    Config.set(globalConfig);
}
function initOverwatch(globalConfig) {
    initConfig(globalConfig);
    recordWindowErrorLog();
    recordUnhandledRejectionLog();
    recordHttpLog();
    recordResourceErrorLog();
    console.log('overwatch-web SDK is initialized.');
}
//# sourceMappingURL=index.js.map

export { initConfig, initOverwatch };
//# sourceMappingURL=index.js.map
