import core from './core';
import * as _ from './utils';
import Deferred from 'mini-dfd';

/**
 * 当前加载的模块的name的deferred
 * @type {Deferred}
 */
let currentModuleNameDfd = null;

export async function requireModule(deps, callback) {
    // 等可能存在的具名模块先载入cache
    await _.sleep(0);
    const argsPro = deps.map(depUrl => getModule(_.pathJoin(core.rootUrl, depUrl)));
    const args = await Promise.all(argsPro);
    _.getType(callback) === 'function' && callback(...args);
}

/**
 * 获取模块主体内容
 *
 * @param {any} sender 原模块内容
 * @param {Array<any>} args 模块依赖的参数
 * @returns
 */
function getModuleResult(sender, args) {
    const senderType = _.getType(sender);  // 模块主体类型

    if (senderType === 'object') {
        return sender;
    }
    else if (senderType === 'function') {
        return sender(...args);
    }
    else {
        throw new Error('module类型异常');
    }
}

export async function defineModule(...args) {

    /**
     * name:   模块名称
     * deps:   模块依赖
     * sender: 模块主体
     *
     * 3种情况：
     * sender
     * deps,sender
     * name,deps,sender
     */
    args.reverse();
    let [sender, deps = [], name = ''] = args;

    if (args.length > 3) {
        throw new Error('模块参数数量异常');
    }


    const afterGetName = async currentModuleName => {
        const joinName = args.length === 3 ? core.rootUrl : currentModuleName;
        const depArgs = await Promise.all(deps.map(depUrl => getModule(_.pathJoin(joinName, depUrl))));
        const moduleResult = getModuleResult(sender, depArgs);
        core.cache[currentModuleName].resolve(moduleResult);
    };

    // 如果是匿名模块，表示异步加载的情况
    if (args.length < 3) {
        currentModuleNameDfd = new Deferred();
        currentModuleNameDfd.then(afterGetName);
        return;
    }

    // 如果是具名模块，即在通过打包工具打包时
    const moduleName = _.pathJoin(core.rootUrl, name);
    core.cache[moduleName] = new Deferred();
    await _.sleep(0);  // 可能依赖了其它具名模块，先注册名称，然后等下一个macrotask
    afterGetName(moduleName);
}

/**
 * 根据 模块名/路径 获取某个模块
 *
 * @export
 * @param {string} name 模块名/路径
 * @returns {Promise<void>}
 */
export async function getModule(name) {
    // 尝试从缓存拿
    if (core.cache[name]) {
        return core.cache[name].promise;
    }

    const moduleDfd = new Deferred();
    core.cache[name] = moduleDfd;

    // 模块加载完毕，立马会触发 load 事件，由此来确定模块所属
    await _.loadScript(name + '.js');
    currentModuleNameDfd.resolve(name);
    return moduleDfd.promise;
}
