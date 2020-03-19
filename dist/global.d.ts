import { GlobalConfig } from './interface';
declare const _default: {
    set: (configObj: GlobalConfig) => boolean;
    get: (configKey: "id" | "appVersion" | "releaseStage" | "reportUrl" | "metaData" | "delay" | "random" | "repeat" | "localExp" | "language" | "callback" | "devEnable") => string | number | true | Record<string, any> | null;
};
export default _default;
