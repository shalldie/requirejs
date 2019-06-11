import 'babel-polyfill';
import path from 'path';
import {expect} from 'chai';
import MochaChrome from 'mocha-chrome';

/**
 * 测试一个文件
 *
 * @param {string} fileName 文件名
 * @return {Promise<any>}
 */
function testFile(fileName) {
    const url = 'file://' + path.join(__dirname, 'html', fileName, 'index.html');

    const runner = new MochaChrome({
        url,
        mocha: {useColors: false},
        ignoreConsole: true,
        ignoreExceptions: true,
        ignoreResourceErrors: true
    });

    const result = new Promise((resolve, reject) => {
        runner.on('ended', stats => {
            resolve(stats);
        });

        runner.on('failure', message => {
            reject(message);
        });
    });

    (async function () {
        await runner.connect();
        await runner.run();
    })();

    return result;
}


describe('测试 模块功能 >_<#@! ', function () {

    it('匿名模块', function () {
        return testFile('no-name-module');
    });

    it('匿名模块的多层级依赖', function () {
        return testFile('no-name-much-deps');
    });

    it('匿名和具名模块混用+多层级', function () {
        return testFile('mix-name-and-no-name');
    });

});
