import core from './core';

import { requireModule, defineModule } from './loader';

let requireName = core.requireName; // 程序入口函数名称,require
let defineName = core.defineName; // 模块定义名称，define

window[requireName] = requireModule;

window[defineName] = defineModule;