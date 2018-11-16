import core from './core';
import { requireModule, defineModule } from "./loader";
import { loadScript } from "./utils";

const {
    coreName,     // 核心模块名称
    requireName,  // 程序入口函数名称,require
    defineName    // 模块定义名称，define
} = core;

window[coreName] = core;  // 暴露出去用于调试
window[requireName] = requireModule;  // require
window[defineName] = defineModule; // define

// 加载 data-main
let script = [].slice.call(document.getElementsByTagName('script')).slice(-1)[0];
core.rootUrl = script.getAttribute("data-main");

loadScript(core.rootUrl);
