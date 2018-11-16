import Deferred from 'mini-dfd';

/**
 * 获取对象类型
 *
 * @export
 * @param {any} sender 需要判断的对象
 * @returns {string}
 */
export function getType(sender) {
    return Object.prototype.toString.call(sender).toLowerCase().match(/\s([^\]]+)/)[1];
}

/**
 * 格式化路径
 *
 * @export
 * @param {string} pathString  需要格式化的路径
 * @returns {string}
 */
export function pathNormalize(pathString) {
    pathString = pathString.replace(/\.js$/, '');
    // 所有目录
    let dirs = pathString.split('/').filter(n => n.length > 0 && n !== '.');
    // 去除所有 ..
    let lastIndex;
    while (~(lastIndex = dirs.indexOf('..'))) {
        dirs.splice(lastIndex - 1, 2);
    }
    return dirs.join('/');
}

/**
 * 根据父路径和依赖路径，计算子路径
 *
 * @export
 * @param {string} path1 父路径
 * @param {string} path2 依赖路径
 * @returns {string}
 */
export function pathJoin(path1, path2) {
    path1 = path1.replace(/\/[^\/]*?$/, '');
    return pathNormalize(`${path1}/${path2}`);
}

/**
 * 加载一个script
 *
 * @export
 * @param {string} src script的地址
 * @returns {Promise<void>}
 */
export function loadScript(src, onload = function () { }) {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.charset = 'utf-8';
    script.async = true;

    const dfd = new Deferred();
    script.onload = () => {
        onload();
        dfd.resolve();
    };

    script.src = src;

    // console.log(src);
    document.head.appendChild(script);
    return dfd.promise;
}

/**
 * 等待若干时间
 *
 * @export
 * @param {number} delay 要等待的毫秒数
 * @returns {Promise<void>}
 */
export function sleep(delay) {
    const dfd = new Deferred();
    setTimeout(() => dfd.resolve(), delay);
    return dfd.promise;
}
