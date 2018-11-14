/**
 * 默认核心载体
 */
export default {
    /**
     *  版本
     */
    ver: "0.0.1",
    /**
     * 模块定义名称
     */
    defineName: "define",
    /**
     * 程序入口函数
     */
    requireName: "require",
    /**
     * 暴露的全局名称，可用于配置
     */
    coreName: "requirejs",
    /**
     * 根目录，入口文件目录
     */
    rootUrl: "",
    /**
     * 依赖模块缓存字典
     */
    cache: {  // 模块字典 {key:string,value:promise}

    }
};
