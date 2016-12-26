import deferred from './deferred';
import _ from '../tool/tool';

export default function (promises) {
    promises = _.makeArray(promises);
    let len = promises.length,    // promise 个数
        resNum = 0,               // resolve 的数量
        argsArr = new Array(len), // 每个reject的参数
        dfd = deferred(),    // 用于当前task控制的deferred
        pro = dfd.promise();      // 用于当前返回的promise

    if (len === 0) {   // 如果是个空数组，直接就返回了
        dfd.resolve();
        return pro;
    }

    function addThen() {   // 检测是否全部完成
        resNum++;
        let args = _.makeArray(arguments);
        let index = args.shift(); // 当前参数在promises中的索引

        if (args.length <= 1) {             // 保存到数组，用户回调
            argsArr[index] = args[0];
        } else {
            argsArr[index] = args;
        }

        if (resNum >= len) {         // 如果所有promise都resolve完毕
            dfd.resolve(argsArr);
        }
    }

    function addCatch() {  // 如果某个promise发生了reject 
        var args = _.makeArray(arguments);
        dfd.reject(...args);
    }

    _.each(promises, (index, promise) => {
        promise.then(function () {
            addThen(index, ...arguments);
        }).catch(addCatch);
    });

    return pro;
}