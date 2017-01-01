import core from './core';
import deferred from './async/deferred';
import all from './async/all';
import _ from './tool/tool';

let lastNameDfd = null; // 最后一个加载的module的name的 deferred


/**
 * 程序入口， require
 * 
 * @export
 * @param {any} deps 依赖项
 * @param {any} callback 程序入口
 */
export function requireModule(deps, callback) {
    setTimeout(function () {  // 避免阻塞同文件中，使用名称定义的模块
        deps = deps.map(url => getModule(_.resolvePath(core.rootUrl, url)));
        all(deps).then(function (args) {
            callback(...args);
        });
    }, 0);
}

/**
 * 模块定义，url,deps,sender
 * 
 * @export
 */
export function defineModule() {
    let args = _.makeArray(arguments);
    let name = "",     // 模块名称
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

    let dfdThen = (_name, lastModule) => {
        _name = _.normalizePath(_name); // 名称，路径

        proArr = proArr.map(url => {  // 各个依赖项 
            url = _.resolvePath(_name, url); // 以当前路径为基准，合并路径
            return getModule(url);
        });

        all(proArr).then(function (_args) {  // 在依赖项加载完毕后，进行模块处理
            _args = _args || [];
            let result; // 最终结果
            let _type = _.type(sender); // 回调模块类型

            if (_type == "function") {
                result = sender(..._args);
            }
            else if (_type == "object") {
                result = sender;
            }
            else {
                throw Error("参数类型错误");
            }

            lastModule.resolve(result);

        });
    };

    if (argsLen < 3) {  // 如果是匿名模块，使用 onload 来判断js的名称／路径
        lastNameDfd = deferred();  // 先获取当前模块名称

        lastNameDfd.then(dfdThen);
    }
    else {  // 如果是自定义模块名，直接触发,命名模块直接添加
        let lastModule = deferred();
        let dictName = _.resolvePath(core.rootUrl, name);
        core.dict[dictName] = lastModule;

        let namedDfd = deferred().then(dfdThen);

        setTimeout(function () {   // 避免同文件中，多个命名模块注册阻塞，先把名字注册了，具体内容等待一下 event loop 
            namedDfd.resolve(dictName, lastModule);
        }, 0);
    }

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

    let script = addScript(name);

    let dfd = deferred();
    dict[name] = dfd;

    script.onload = function () {  // 模块加载完毕，立马会触发 load 事件，由此来确定模块所属
        let lastModule = deferred();
        lastNameDfd.resolve(name, lastModule); // 绑定当前模块的名称

        lastModule.then(result => {  // 在模块加载完毕之后，触发该模块的 resolve
            dfd.resolve(result);
        });
    };

    return dfd.promise();
}

/**
 * 添加 script 标签
 * 
 * @export
 * @param {any} name
 * @returns
 */
export function addScript(name) {
    let script = document.createElement('script');
    script.type = "text/javascript";
    script.async = true;
    script.charset = "utf-8";
    script.src = name + ".js";
    document.head.appendChild(script);
    return script;
}