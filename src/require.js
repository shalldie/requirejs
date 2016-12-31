import core from './core';

import { requireModule, defineModule, addScript } from './loader';

let coreName = core.coreName; // 核心模块名称  
let requireName = core.requireName; // 程序入口函数名称,require
let defineName = core.defineName; // 模块定义名称，define

window[coreName] = core;  // 这里暴露出去，主要用于调试

window[requireName] = requireModule;

window[defineName] = defineModule;

// 加载 data-main
let script = [].slice.call(document.getElementsByTagName('script')).slice(-1)[0];
core.rootUrl = script.getAttribute("data-main");

addScript(core.rootUrl);