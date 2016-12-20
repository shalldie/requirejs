import _ from './tool';
import callbacks from './callbacks';

/**
 * deferred 模块
 * 
 * @export
 * @returns deferred
 */
export default function () {
    let tuples = [   // 用于存放一系列回调的 tuple 结构
        // 方法名 - 接口名称 - 回调列表 - 最终状态
        ['resolve', 'then', callbacks('once memory'), 'resolved'],
        ['reject', 'catch', callbacks('once memory'), 'rejected']
    ];

    let _state = 'pending';    // 当前状态

    let dfd = {                // 返回的延迟对象
        state: function () {
            return _state;
        },      // 状态
        promise: function () { // promise - 仅提供接口用于注册/订阅
            let self = this;
            let pro = {
                state: self.state
            };
            _.each(tuples, (i, tuple) => { // 订阅接口
                pro[tuple[1]] = self[tuple[1]];
            });
            return pro;
        }
    };

    _.each(tuples, (i, tuple) => {
        dfd[tuple[0]] = function () {       // 触发
            if (_state != "pending") return this;
            tuple[2].fire.apply(tuple[2], _.makeArray(arguments));
            _state = tuple[3];
            return this;
        };
        dfd[tuple[1]] = function (cb) {     // 绑定
            tuple[2].add(cb);
            return this;
        };
    });

    return dfd;
}