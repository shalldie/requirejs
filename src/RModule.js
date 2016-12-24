import _ from './tool/tool';
import deferred from './async/deferred';


export class RModule {
    constructor(url, dependences, sender) {
        this.url = url;
        this.dependences = dependences || [];
        this.sender = sender;
        this.init();

        this.result = deferred(); // 用于回调
    }

    /**
     * 初始化
     * 
     * 
     * @memberOf RModule
     */
    init() {
        this.dirName = "";
        this.name = "";
    }
}

export default function rmodule(url, dependences, sender) {

    let dfd = deferred();  // 返回的 deferred 依赖 

    let dep = dependences.map(depUrl => {
        depUrl = _.resolvePath(url, depUrl);
        let pro= rmodule(depUrl)
    });

    return {
        url: url
    }
}