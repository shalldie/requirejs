import core from './core';
import * as _ from './utils';
import Deferred from 'mini-dfd';

export function requireModule(deps, callback) {

}

// 当前加载的模块
/**
 * @type { {name:string,module:any} }
 */
let currentModule = {};

export function defineModule(...args) {

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

    const depList = deps.map(url => {

    });

    if (args.length < 3) {  // 如果是匿名模块，表示异步加载的情况
        const senderType = _.getType(sender);

    }

}

/**
 * 根据 模块名/路径 获取某个模块
 *
 * @export
 * @param {string} name 模块名/路径
 * @returns {Promise<any>}
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
    moduleDfd.resolve(currentModule.module);
    return core.cache[name];
}
