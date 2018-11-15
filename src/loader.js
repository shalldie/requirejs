import core from './core';
import * as _ from './utils';
import Deferred from 'mini-dfd';

// 当前加载的模块
/**
 * @type { {name:string,moduleDfd:Deferred} }
 */
let currentModule = {};

export async function requireModule(deps, callback) {
    await _.sleep(0);
    const args = await Promise.all(deps.map(depUrl => getModule(depUrl)));
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
    console.log('define before  getmodule');
    // 等下一个tick，即在 onload 事件结束，onload中会更新currentModule，需要从中取name
    await _.sleep(0);

    console.log('define after  getmodule');

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
    let [sender, deps = [], name = currentModule.name] = args;

    if (args.length > 3) {
        throw new Error('模块参数数量异常');
    }

    // 如果是匿名模块，表示异步加载的情况
    if (args.length < 3) {
        const depArgs = await Promise.all(deps.map(depUrl => getModule(_.pathJoin(name, depUrl))));
        const moduleResult = getModuleResult(sender, depArgs);
        currentModule.moduleDfd.resolve(moduleResult);
        return;
    }

    // 如果是具名模块，即在通过打包工具打包时
    const nameDfd = new Deferred();
    core.cache[name] = nameDfd.promise;
    await _.sleep(0);  // 可能依赖了其它具名模块，先注册名称，然后等下一个macrotask
    const depArgs = await Promise.all(deps.map(depUrl => getModule(depUrl)));
    const moduleResult = getModuleResult(sender, depArgs);
    nameDfd.resolve(moduleResult);
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
        return core.cache[name];
    }

    const moduleDfd = new Deferred();
    core.cache[name] = moduleDfd.promise;

    // 模块加载完毕，立马会触发 load 事件，由此来确定模块所属
    await _.loadScript(name + '.js');
    currentModule.name = name;
    currentModule.moduleDfd = moduleDfd;
    console.log('get momdule');
    return moduleDfd.promise;
}
