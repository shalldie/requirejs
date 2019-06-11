import 'babel-polyfill';
import {expect} from 'chai';
import {getType, pathJoin, pathNormalize, sleep} from '../src/utils';

describe('测试工具包  >_<#@! ', function () {

    it('getType', function () {
        expect(getType({})).to.be.equal('object');
        expect(getType([])).to.be.equal('array');
        expect(getType(1)).to.be.equal('number');
    });

    it('pathJoin', function () {
        expect(pathJoin('a/b/c', '../../d/e')).to.be.equal('d/e');
        expect(pathJoin('a/b/c', './../d/e')).to.be.equal('a/d/e');
        expect(pathJoin('a/b/c', 'd/e')).to.be.equal('a/b/d/e');
    });

    it('pathNormalize', function () {
        expect(pathNormalize('a/b/c/.././d/e')).to.be.equal('a/b/d/e');
        expect(pathNormalize('./a/b/c/../.././d/e')).to.be.equal('a/d/e');
    });

    it('sleep', async function () {
        let temp = 1;

        // 在 microTask 中改变值
        process.nextTick(() => {
            temp = 2;
        });

        // 当前 macroTask 值没变
        expect(temp).to.be.equal(1);

        // 在 下一个 macroTask 中值应该改变了
        await sleep(0);

        expect(temp).to.be.equal(2);
    });

});
