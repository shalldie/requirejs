import core from './core';
import deferred from './async/deferred';
import all from './async/all';
import _ from './tool/tool';

let defineName = core.defineName; // 模块定义名称，define


function defineModule() {
    let args = _.makeArray(arguments);
    let name,     // 模块名称
        proArr,   // 模块依赖
        callback; // 模块的函数体

    let argsLen = args.length;

    if (argsLen == 1) {  // 重载一下
        proArr = [];
        callback = args[0];
    }
    else if (argsLen == 2) {
        proArr = args[0];
        callback = args[1];
    }
    else if (argsLen == 3) {
        name = args[0];
        proArr = args[1];
        callback = args[2];
    }
    else {
        throw Error('length of arguments has Error');
    }




}