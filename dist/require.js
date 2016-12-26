/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _core = __webpack_require__(1);

	var _core2 = _interopRequireDefault(_core);

	var _loader = __webpack_require__(2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var requireName = _core2.default.requireName; // 程序入口函数名称,require
	var defineName = _core2.default.defineName; // 模块定义名称，define

	window[requireName] = _loader.requireModule;

	window[defineName] = _loader.defineModule;

	var script = [].slice.call(document.getElementsByTagName('script')).slice(-1)[0];
	_core2.default.rootUrl = script.getAttribute("data-main");

	(0, _loader.addScript)(_core2.default.rootUrl);

/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	/**
	 * 默认核心载体
	 */
	exports.default = {
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
	   * 根目录，入口文件目录
	   */
	  rootUrl: "",
	  /**
	   * 依赖模块存储字典
	   */
	  dict: {// 模块字典 {key:string,value:promise}

	  }
	};

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.requireModule = requireModule;
	exports.defineModule = defineModule;
	exports.addScript = addScript;

	var _core = __webpack_require__(1);

	var _core2 = _interopRequireDefault(_core);

	var _deferred = __webpack_require__(3);

	var _deferred2 = _interopRequireDefault(_deferred);

	var _all = __webpack_require__(6);

	var _all2 = _interopRequireDefault(_all);

	var _tool = __webpack_require__(4);

	var _tool2 = _interopRequireDefault(_tool);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	var lastNameDfd = null; // 最后一个加载的module的name的 deferred


	/**
	 * 程序入口， require
	 * 
	 * @export
	 * @param {any} deps 依赖项
	 * @param {any} callback 程序入口
	 */
	function requireModule(deps, callback) {
	    deps = deps.map(function (url) {
	        return getModule(_tool2.default.resolvePath(_core2.default.rootUrl, url));
	    });
	    setTimeout(function () {
	        // 避免阻塞同文件中，使用名称定义的模块
	        (0, _all2.default)(deps).then(callback);
	    }, 0);
	}

	/**
	 * 模块定义，url,deps,sender
	 * 
	 * @export
	 */
	function defineModule() {
	    var args = _tool2.default.makeArray(arguments);
	    var name = "",
	        // 模块名称
	    proArr = void 0,
	        // 模块依赖
	    sender = void 0; // 模块的主体

	    var argsLen = args.length; // 参数的个数，用来重载

	    if (argsLen == 1) {
	        // 重载一下   sender
	        proArr = [];
	        sender = args[0];
	    } else if (argsLen == 2) {
	        // deps,sender
	        proArr = args[0];
	        sender = args[1];
	    } else if (argsLen == 3) {
	        // name,deps,sender
	        name = args[0];
	        proArr = args[1];
	        sender = args[2];
	    } else {
	        throw Error('参数个数异常');
	    }

	    lastNameDfd = (0, _deferred2.default)(); // 先获取当前模块名称

	    lastNameDfd.then(function (name, lastModule) {
	        name = _tool2.default.normalizePath(name); // 名称，路径

	        proArr = proArr.map(function (url) {
	            // 各个依赖项 
	            url = _tool2.default.resolvePath(name, url); // 以当前路径为基准，合并路径
	            return getModule(url);
	        });

	        (0, _all2.default)(proArr).then(function (_args) {
	            // 在依赖项加载完毕后，进行模块处理
	            _args = _args || [];
	            var result = void 0; // 最终结果
	            var _type = _tool2.default.type(sender); // 回调模块类型

	            if (_type == "function") {
	                result = sender.apply(undefined, _toConsumableArray(_args));
	            } else if (_type == "object") {
	                result = sender;
	            } else {
	                throw Error("参数类型错误");
	            }

	            lastModule.resolve(result);

	            if (argsLen == 3) {
	                // 只有在外部js作为模块，才进行回调处理，命名模块直接添加
	                _core2.default.dict[name] = lastModule;
	            }
	        });
	    });

	    if (argsLen == 3) {
	        // 如果是自定义模块名，直接触发
	        lastNameDfd.resolve(name, (0, _deferred2.default)());
	    }
	}

	/**
	 * 根据 路径/名称 ，加载/获取模块的promise
	 * 
	 * @param {any} name
	 * @returns promise
	 */
	function getModule(name) {
	    var dict = _core2.default.dict;
	    if (dict[name]) {
	        return dict[name];
	    }

	    var script = addScript(name);

	    var dfd = (0, _deferred2.default)();
	    dict[name] = dfd;

	    script.onload = function () {
	        // 模块加载完毕，立马会触发 load 事件，由此来确定模块所属
	        var lastModule = (0, _deferred2.default)();
	        lastNameDfd.resolve(name, lastModule); // 绑定当前模块的名称

	        lastModule.then(function (result) {
	            // 在模块加载完毕之后，触发该模块的 resolve
	            dfd.resolve(result);
	        });
	    };

	    return dfd.promise();
	}

	/**
	 * 添加 script 标签
	 * 
	 * @export
	 * @param {any} name
	 * @returns
	 */
	function addScript(name) {
	    var script = document.createElement('script');
	    script.type = "text/javascript";
	    script.async = true;
	    script.charset = "utf-8";
	    script.src = name + ".js";
	    document.head.appendChild(script);
	    return script;
	}

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	exports.default = function () {
	    var tuples = [// 用于存放一系列回调的 tuple 结构
	    // 方法名 - 接口名称 - 回调列表 - 最终状态
	    ['resolve', 'then', (0, _callbacks2.default)('once memory'), 'resolved'], ['reject', 'catch', (0, _callbacks2.default)('once memory'), 'rejected']];

	    var _state = 'pending'; // 当前状态

	    var dfd = { // 返回的延迟对象
	        state: function state() {
	            return _state;
	        }, // 状态
	        promise: function promise() {
	            // promise - 仅提供接口用于注册/订阅
	            var self = this;
	            var pro = {
	                state: self.state
	            };
	            _tool2.default.each(tuples, function (i, tuple) {
	                // 订阅接口
	                pro[tuple[1]] = self[tuple[1]];
	            });
	            return pro;
	        }
	    };

	    _tool2.default.each(tuples, function (i, tuple) {
	        dfd[tuple[0]] = function () {
	            // 触发
	            if (_state != "pending") return this;
	            tuple[2].fire.apply(tuple[2], _tool2.default.makeArray(arguments));
	            _state = tuple[3];
	            return this;
	        };
	        dfd[tuple[1]] = function (cb) {
	            // 绑定
	            tuple[2].add(cb);
	            return this;
	        };
	    });

	    return dfd;
	};

	var _tool = __webpack_require__(4);

	var _tool2 = _interopRequireDefault(_tool);

	var _callbacks = __webpack_require__(5);

	var _callbacks2 = _interopRequireDefault(_callbacks);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = {
	    /**
	     * 获取对象类型
	     * 
	     * @param {any} sender
	     * @returns
	     */
	    type: function type(sender) {
	        return sender === null ? sender + "" : Object.prototype.toString.call(sender).toLowerCase().match(/\s([^\]]+)/)[1];
	    },
	    /**
	     * 遍历
	     * 
	     * @param {any} sender
	     * @param {any} callback
	     */
	    each: function each(sender, callback) {
	        var i = 0,
	            // 循环用变量
	        len = sender.length,
	            // 长度
	        arrayLike = this.arrayLike(sender),
	            // 是否属于(类)数组
	        result = void 0; // 回调的结果

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
	    arrayLike: function arrayLike(sender) {
	        // duck typing ，检测是否属于数组
	        return this.type(sender.length) == 'number' && this.type(sender.splice) == 'function';
	    },
	    /**
	     * 将(伪)数组转化成数组
	     * 
	     * @param {any} sender
	     * @returns
	     */
	    makeArray: function makeArray(sender) {
	        try {
	            return [].slice.call(sender);
	        } catch (ex) {
	            var arr = [],
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
	    normalizePath: function normalizePath(path) {
	        path = path.replace(/\.js$/, ''); // 去掉末尾的 .js

	        path = path.replace(/\/+/g, '/'); // 将多余的 / 转换成一个

	        path = path.replace(/\/\.\//g, '/'); //  /./ => /

	        path = path.replace(/$\.\//g, ''); // 起始位置的 ./ 去掉

	        while (~path.indexOf('../')) {
	            // 去掉   ../
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
	    resolvePath: function resolvePath(from, to) {
	        from = from.replace(/\/[^\/]+$/, '');
	        if (to) {
	            from += "/" + to;
	        }
	        return this.normalizePath(from);
	    }
	};

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	exports.default = function () {
	    var list = [],
	        _args = (arguments[0] || '').split(' '),
	        // 参数数组
	    fireState = 0,
	        // 触发状态  0-未触发过 1-触发中  2-触发完毕
	    stopOnFalse = ~_args.indexOf('stopOnFalse'),
	        // stopOnFalse - 如果返回false就停止
	    once = ~_args.indexOf('once'),
	        // once - 只执行一次，即执行完毕就清空
	    memory = ~_args.indexOf('memory') ? [] : null,
	        // memory - 保持状态
	    fireArgs = []; // fire 参数

	    /**
	     * 添加回调函数
	     * 
	     * @param {any} cb
	     * @returns callbacks
	     */
	    function add(cb) {
	        if (memory && fireState == 2) {
	            // 如果是memory模式，并且已经触发过
	            cb.apply(null, fireArgs);
	        }

	        if (disabled()) return this; // 如果被disabled

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

	        fireArgs = _tool2.default.makeArray(arguments); // 保存 fire 参数

	        fireState = 1; // 触发中 

	        _tool2.default.each(list, function (index, cb) {
	            // 依次触发回调
	            if (cb.apply(null, fireArgs) === false && stopOnFalse) {
	                // stopOnFalse 模式下，遇到false会停止触发
	                return false;
	            }
	        });

	        fireState = 2; // 触发结束

	        if (once) disable(); // 一次性列表

	        return this;
	    }

	    function disable() {
	        // 禁止
	        list = undefined;
	        return this;
	    }

	    function disabled() {
	        // 获取是否被禁止
	        return !list;
	    }

	    return {
	        add: add,
	        fire: fire,
	        disable: disable,
	        disabled: disabled
	    };
	};

	var _tool = __webpack_require__(4);

	var _tool2 = _interopRequireDefault(_tool);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	exports.default = function (promises) {
	    promises = _tool2.default.makeArray(promises);
	    var len = promises.length,
	        // promise 个数
	    resNum = 0,
	        // resolve 的数量
	    argsArr = new Array(len),
	        // 每个reject的参数
	    dfd = (0, _deferred2.default)(),
	        // 用于当前task控制的deferred
	    pro = dfd.promise(); // 用于当前返回的promise

	    if (len === 0) {
	        // 如果是个空数组，直接就返回了
	        dfd.resolve();
	        return pro;
	    }

	    function addThen() {
	        // 检测是否全部完成
	        resNum++;
	        var args = _tool2.default.makeArray(arguments);
	        var index = args.shift(); // 当前参数在promises中的索引

	        if (args.length <= 1) {
	            // 保存到数组，用户回调
	            argsArr[index] = args[0];
	        } else {
	            argsArr[index] = args;
	        }

	        if (resNum >= len) {
	            // 如果所有promise都resolve完毕
	            dfd.resolve(argsArr);
	        }
	    }

	    function addCatch() {
	        // 如果某个promise发生了reject 
	        var args = _tool2.default.makeArray(arguments);
	        dfd.reject.apply(dfd, _toConsumableArray(args));
	    }

	    _tool2.default.each(promises, function (index, promise) {
	        promise.then(function () {
	            addThen.apply(undefined, [index].concat(Array.prototype.slice.call(arguments)));
	        }).catch(addCatch);
	    });

	    return pro;
	};

	var _deferred = __webpack_require__(3);

	var _deferred2 = _interopRequireDefault(_deferred);

	var _tool = __webpack_require__(4);

	var _tool2 = _interopRequireDefault(_tool);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/***/ }
/******/ ]);