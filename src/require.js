import core from './core';

import { requireModule, defineModule, addScript } from './loader';

let requireName = core.requireName; // 程序入口函数名称,require
let defineName = core.defineName; // 模块定义名称，define

window[requireName] = requireModule;

window[defineName] = defineModule;


let script = [].slice.call(document.getElementsByTagName('script')).slice(-1)[0];
core.rootUrl = script.getAttribute("data-main");

addScript(core.rootUrl);