define({
    /**
     * 检查对象类型
     *
     * @param {any} sender
     * @returns
     */
    type: function (sender) {
        return sender === null ? sender + "" : Object.prototype.toString.call(sender).match(/\s([^\]]+)/)[1].toLowerCase();
    },
    /**
     * 遍历对象
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
     * 检测是否属于 (伪)数组
     *
     * @param {any} sender
     * @returns
     */
    arrayLike: function (sender) {
        // duck typing ，检测是否属于数组
        return this.type(sender.length) == 'number' && this.type(sender.splice) == 'function';
    },
    /**
     * 变成大写
     *
     * @param {any} sender
     * @returns
     */
    toUpperCase: function (sender) {
        return sender.toUpperCase();
    },
    /**
     * 变成小写
     *
     * @param {any} sender
     * @returns
     */
    toLowerCase: function (sender) {
        return sender.toLowerCase();
    }
});
