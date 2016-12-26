import core from './core';
import deferred from './async/deferred';
import all from './async/all';
import _ from './tool/tool';

let defineName = core.defineName; // 模块定义名称，define

let lastModule = null; // 最后一个加载的module


function defineModule() {
    let args = _.makeArray(arguments);
    let name,     // 模块名称
        proArr,   // 模块依赖
        sender; // 模块的主体

    let argsLen = args.length; // 参数的个数，用来重载

    if (argsLen == 1) {  // 重载一下   sender
        proArr = [];
        sender = args[0];
    }
    else if (argsLen == 2) {  // deps,sender
        proArr = args[0];
        sender = args[1];
    }
    else if (argsLen == 3) {  // name,deps,sender
        name = args[0];
        proArr = args[1];
        sender = args[2];
    }
    else {
        throw Error('参数个数异常');
    }

    name = _.normalizePath(name); // 名称，路径

    proArr = proArr.map(url => {  // 各个依赖项 
        url = _.resolvePath(name, url); // 以当前路径为基准，合并路径
        return getModule(url);
    });


    all(proArr).then(function (args) {  // 在依赖项加载完毕后，进行模块处理
        let _type = _.type(sender);  // 回调模块类型 

        if (!~[1, 2].indexOf(argsLen)) {  // 只有在外部js作为模块，才进行回调处理，命名模块直接添加
            return;
        }

        let dfd = core.dict[name];

        if (_type == "function") {
            dfd.resolve(sender(args));
        }
        else if (_type == "object") {
            dfd.resolve(sender);
        }
        else {
            throw Error('模块定义异常');
        }
    });

}

/**
 * 根据 路径/名称 ，加载/获取模块的promise
 * 
 * @param {any} name
 * @returns promise
 */
function getModule(name) {
    let dict = core.dict;
    if (dict[name]) {
        return dict[name];
    }

    let script = document.createElement('script');
    script.type = "text/javascript";
    script.async = true;
    script.charset = "utf-8";
    script.src = name;

    let dfd = deferred();

    script.onload = function () {  // 模块加载完毕，立马会触发 load 事件，由此来确定模块所属
        dict[name] = lastModule;
    };

    document.body.appendChild(script);

    return dfd.promise();
}