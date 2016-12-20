import _ from '../tool/tool';

/**
 * 基础回调模块
 * 
 * @export
 * @returns callbacks
 */
export default function () {
    let list = [],
        _args = (arguments[0] || '').split(' '),           // 参数数组
        fireState = 0,                                     // 触发状态  0-未触发过 1-触发中  2-触发完毕
        stopOnFalse = ~_args.indexOf('stopOnFalse'),       // stopOnFalse - 如果返回false就停止
        once = ~_args.indexOf('once'),                     // once - 只执行一次，即执行完毕就清空
        memory = ~_args.indexOf('memory') ? [] : null,     // memory - 保持状态
        fireArgs = [];                                     // fire 参数

    /**
     * 添加回调函数
     * 
     * @param {any} cb
     * @returns callbacks
     */
    function add(cb) {
        if (memory && fireState == 2) {  // 如果是memory模式，并且已经触发过
            cb.apply(null, fireArgs);
        }

        if (disabled()) return this;      // 如果被disabled

        list.push(cb);
        return this;
    }

    /**
     * 触发
     * 
     * @param {any} 任意参数
     * @returns callbacks
     */
    function fire() {
        if (disabled()) return this; // 如果被禁用

        fireArgs = _.makeArray(arguments); // 保存 fire 参数

        fireState = 1; // 触发中 

        _.each(list, (index, cb) => { // 依次触发回调
            if (cb.apply(null, fireArgs) === false && stopOnFalse) { // stopOnFalse 模式下，遇到false会停止触发
                return false;
            }
        });

        fireState = 2; // 触发结束

        if (once) disable(); // 一次性列表

        return this;
    }

    function disable() {    // 禁止
        list = undefined;
        return this;
    }

    function disabled() {  // 获取是否被禁止
        return !list;
    }

    return {
        add: add,
        fire: fire,
        disable: disable,
        disabled: disabled
    };
}
