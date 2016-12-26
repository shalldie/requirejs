export default {
    /**
     * 获取对象类型
     * 
     * @param {any} sender
     * @returns
     */
    type: function (sender) {
        return sender === null ? (sender + "") :
            (
                Object.prototype.toString.call(sender).toLowerCase().match(/\s([^\]]+)/)[1]
            );
    },
    /**
     * 遍历
     * 
     * @param {any} sender
     * @param {any} callback
     */
    each: function (sender, callback) {
        let i = 0,                      // 循环用变量
            len = sender.length,           // 长度
            arrayLike = this.arrayLike(sender), // 是否属于(类)数组
            result;        // 回调的结果

        if (arrayLike) {
            for (; i < len; i++) {
                result = callback.call(sender[i], i, sender[i]);
                // true 的时候continue 省略
                if (result === false) break;
            }
        } else {
            for (i in sender) {
                result = callback.call(sender[i], i, sender[i]);
                // true 的时候continue 省略
                if (result === false) break;
            }
        }
    },
    /**
     * 检测是否是(伪)数组类型
     * 
     * @param {any} sender
     * @returns
     */
    arrayLike: function (sender) {
        // duck typing ，检测是否属于数组
        return this.type(sender.length) == 'number' && this.type(sender.splice) == 'function';
    },
    /**
     * 将(伪)数组转化成数组
     * 
     * @param {any} sender
     * @returns
     */
    makeArray: function (sender) {
        try {
            return [].slice.call(sender);
        }
        catch (ex) {
            let arr = [],
                i = 0,
                len = sender.length;
            for (; i < len; i++) {
                arr.push(sender[i]);
            }
            return arr;
        }
    },
    /**
     * 规范化路径
     * 
     * @param {any} path
     * @returns 规范化后的路径
     */
    normalizePath: function (path) {
        path = path.replace(/\.js$/, ''); // 去掉末尾的 .js

        path = path.replace(/\/+/g, '/'); // 将多余的 / 转换成一个

        path = path.replace(/\/\.\//g, '/'); //  /./ => /

        path = path.replace(/$\.\//g, '');  // 起始位置的 ./ 去掉

        while (~path.indexOf('../')) {  // 去掉   ../
            path = path.replace(/[^\.\/]+\/\.\.\//g, '');
        }

        return path;
    },
    /**
     * 合并路径
     * 
     * @param {any} from 起始路径
     * @param {any} to 目标路径
     * @returns 合并后的规范路径
     */
    resolvePath: function (from, to) {
        from = from.replace(/\/[^\/]+$/, '');
        if (to) {
            from += "/" + to;
        }
        return this.normalizePath(from);
    }
};