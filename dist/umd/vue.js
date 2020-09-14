(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
}(this, (function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(Object(source), true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function isObject(data) {
    return _typeof(data) === 'object' && data !== null;
  }
  function def(data, key, value) {
    Object.defineProperty(data, key, {
      enumerable: false,
      configurable: false,
      value: value
    });
  }
  var LIFECYCLE_HOOKS = ['beforeCreate', 'created', 'beforeMount', 'mounted', 'beforeUpdate', 'upadted', 'beforeDestroy', 'destroyed'];

  function mergeHook(parent, child) {
    if (child) {
      // 新的有
      if (parent) {
        // 如果新的有老得也有
        return parent.concat(child);
      } else {
        return [child]; // 首次肯定都没有，所以返回一个数组过去，所以下次的parent可以用concat方法。
      }
    } else {
      // 新的没有，老得有
      return parent;
    }
  }

  var strats = {};
  LIFECYCLE_HOOKS.forEach(function (hook) {
    strats[hook] = mergeHook;
  }); // 合并两个对象。使用Object。assign 或者 {...} 只会将后者中的相同key直接覆盖前者中的相同key。而这个是对对象中的key进行合并。不是直接覆盖。
  // 都有同样的属性,且其值为基本数据类型，以child的为主， parent的扔掉
  // 都有同样的属性,且其值为引用数据类型，将这两个对象合并，该引用数据类型中有相同的值仍然以上个条件为主。

  function mergeOptions(parent, child) {
    var options = {}; // 需要对 parent对象进行遍历

    for (var key in parent) {
      mergeField(key);
    } // 也需要对child进行遍历


    for (var _key in child) {
      // 如果合并过了(上面的走完了才会走到这)， 那么就不需要合并了
      if (!parent.hasOwnProperty(_key)) {
        mergeField(_key);
      }
    } // 默认的合并策略， 有些属性需要有特殊的合并方式，生命周期的合并


    function mergeField(key) {
      if (strats[key]) {
        return options[key] = strats[key](parent[key], child[key]);
      } // 如果parent和child都是引用数据类型


      if (_typeof(parent[key]) === 'object' && _typeof(child[key]) === 'object') {
        options[key] = _objectSpread2(_objectSpread2({}, parent[key]), child[key]); // 如果儿子没有，那么就直接将parent的值放给options。
      } else if (child[key] == null) {
        options[key] = parent[key];
      } else {
        // 如果是不是上面的情况
        options[key] = child[key];
      }
    }

    return options;
  }

  // 我要重写数组的那7个方法， push、shift、unshift、pop、reverse、sort、splice  会导致数组本身发生变化
  var oldArrayMethods = Array.prototype;
  var arrayMethods = Object.create(oldArrayMethods);
  /*
  arrayMethods = {
      constructor: ƒ Array()
      pop: ƒ pop()
      push: ƒ push()
      reverse: ƒ reverse()
      shift: ƒ shift()
      slice: ƒ slice()
      sort: ƒ sort()
      splice: ƒ splice()
      unshift: ƒ unshift()
      ...
  }
    当我们定义的数据是数组的时候调用这些方法会到这里来找，这么做的好处是我们掌握了调用这些方法的控制权，可以对这个对象中的方法进行重写。 而且对于其他的方法并不影响其原有逻辑。  记住：拿到了控制权就可以加入自己的逻辑
   */

  /* 
      我们的目的是什么？
      是让用户 插入/修改的值也获取数据相应的效果
      但是我们还需要调用数组原有的方法
      我们 需要在这调用这七个方法中加入自己的逻辑处理。然后处理完毕在调用数组原有的方法
  */

  var methods = ["push", "shift", "unshift", "pop", "reverse", "sort", "splice"];
  methods.forEach(function (method) {
    //  定义方法重写数组原有的方法
    // 重新定义arrayMethods中的方法
    arrayMethods[method] = function () {
      var inserted; // 当前用户插入的元素

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      switch (method) {
        case 'push':
        case 'unshift':
          inserted = args;
          break;

        case 'splice':
          // splice 有删除、修改、新增的功能。我们需要对新增/修改的数据进行劫持。
          inserted = args.slice(2);
          break;
      }

      this.__ob__.observerArray(inserted); // 调用原生方法走原来的逻辑


      Array.prototype[method].apply(this, args);
    };
  });

  // dep存的是watcher。dep收集依赖。

  /* 
      wathcer 和 dep的关系
      一个watcher 对应n个dep
      一个dep 对应多个watcher
  */
  var id = 0;

  var Dep = /*#__PURE__*/function () {
    function Dep() {
      _classCallCheck(this, Dep);

      this.id = id++;
      this.subs = [];
    }

    _createClass(Dep, [{
      key: "depend",
      value: function depend() {
        this.subs.push(Dep.target);
      }
    }, {
      key: "notify",
      value: function notify() {
        this.subs.forEach(function (watcher) {
          return watcher.update();
        });
      }
    }]);

    return Dep;
  }(); // 一个变量可能引用了多个watcher


  var stack = [];
  function pushTarget(watcher) {
    Dep.target = watcher; // 将渲染watcher存放到Dep.target

    stack.push(watcher);
  }
  function popTarget() {
    stack.pop();
    Dep.target = stack[stack.length - 1];
  }

  var Observer = /*#__PURE__*/function () {
    function Observer(value) {
      _classCallCheck(this, Observer);

      // vue如果数据的层次过多，需要递归的去解析对象中的属性，依次增加set和get方法
      // 对数组进行单独的监测
      // 给value对象加上一个ob属性，记录下当前的observer对象
      def(value, '__ob__', this);

      if (Array.isArray(value)) {
        // 如果是数组的话并不会对索引进行监测，因为会导致性能问题
        // 前端开发一般很少会操作索引， 一般会操作数组的 一些方法
        // 重写这个数组的原型方法
        value.__proto__ = arrayMethods; // 如果数组里放的是对象我再监测

        this.observerArray(value);
      } else {
        this.walk(value);
      }
    }

    _createClass(Observer, [{
      key: "observerArray",
      value: function observerArray(value) {
        for (var i = 0; i < value.length; i++) {
          observe(value[i]); // 劫持数组中的每一项。
        }
      }
    }, {
      key: "walk",
      value: function walk(data) {
        var keys = Object.keys(data);

        for (var i = 0; i < keys.length; i++) {
          var key = keys[i];
          var value = data[key];
          defineReactive(data, key, value);
        }
      }
    }]);

    return Observer;
  }();
  /* 
      正常情况下对一个对象进行取值和赋值操作  是引擎帮我们完成的，我们什么也做不了， 
      但是对象经过defineProperty数据劫持后，我们就可以在取值和赋值的内部进行一些操作。
  */


  function defineReactive(data, key, value) {
    var dep = new Dep();
    observe(value); // 进行递归劫持。对深层次(两层以上)的对象进行递归查询其属性并进行数据劫持。

    Object.defineProperty(data, key, {
      get: function get() {
        // 获取值时的操作
        // 每个属性都对应着自己的wathcer
        if (Dep.target) {
          // 是否经过渲染watcher
          // 把当前wathcer 和 Dep建立一个联系
          dep.depend(); /// 意味着我要将w渲染athcher存起来
        }

        return value;
      },
      set: function set(newValue) {
        // 设置值时的操作
        if (newValue === value) return; // vm._data.obj = {cc: 123}
        // 上一行说明了，如果用户直接赋值了一个对象的话，需要对这个对象进行劫持。

        value = newValue;
        dep.notify(); // 使用notify进行更新。
      }
    });
  }

  function observe(data) {
    // console.log(data)
    if (!isObject(data)) {
      // 抛出错误信息
      // console.error('请返回对象')
      return;
    }

    return new Observer(data); // 用来对数据进行监测
  }

  function proxy(vm, source, key) {
    Object.defineProperty(vm, key, {
      get: function get() {
        return vm[source][key];
      },
      set: function set(newValue) {
        vm[source][key] = newValue;
      }
    });
  }

  function initState(vm) {
    var opts = vm.$options; // vue 的数据来源  属性，方法，数据，计算属性，watch

    if (opts.props) ;

    if (opts.methods) ;

    if (opts.data) {
      initData(vm);
    }

    if (opts.computed) ;

    if (opts.watch) ;
  }

  function initData(vm) {
    // console.log(vm.$options.data)
    // 数据的初始化工作
    var data = vm.$options.data; // 用户传递的data

    data = vm._data = typeof data === 'function' ? data.call(vm) : data; // 为了让用户更好的使用，我希望可以直接vm.xxx

    for (var key in data) {
      proxy(vm, '_data', key);
    } // 对对象进行数据接触， 用户改变了数据， 页面需要得到通知并刷新页面
    // 这就是mvvm模式，数据变化可以驱动视图变化
    // Object.defineProperty()  给属性添加get和set方法


    observe(data);
  }

  var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z]*"; // abc-aaa  // 命名空间

  var qnameCapture = "((?:".concat(ncname, "\\:)?").concat(ncname, ")"); // <aaa:asdads>  ?: 代表匹配不捕获

  var startTagOpen = new RegExp("^<".concat(qnameCapture)); // 标签开头的正则 捕获的内容是标签名

  var endTag = new RegExp("^<\\/".concat(qnameCapture, "[^>]*>")); // 匹配标签结尾的 </div>

  var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性的

  var startTagClose = /^\s*(\/?)>/; // 匹配标签结束的 >  也能是自闭合标签，所以 />

  var root = null;
  var currentParent; // 表示当前父亲是谁

  var stack$1 = [];
  var ELEMENT_TYPE = 1;
  var TEXT_TYPE = 3;

  function createASTElement(tagName, attrs) {
    return {
      tag: tagName,
      type: ELEMENT_TYPE,
      children: [],
      attrs: attrs,
      parent: null
    };
  } // 在开发中不会使用模版。会降低性能
  // 匹配到开始标签


  function start(tagName, attrs) {
    // 匹配到开始标签，就创建一个ast元素。
    // console.log('开始标签', tagName, '属性', attrs)
    var element = createASTElement(tagName, attrs);

    if (!root) {
      root = element; // root做为一个引用变量，只有在root:null的时候可以被赋值
    }

    currentParent = element; // 其他的情况直接将 当前匹配到的element 赋值给currentParent， 不会影响到root了。也就是说root只有一次机会被改变，就是root为null的时候。每匹配到一次开始标签都是一次新的开始。这个匹配到的开始标签就暂时作为了顶层元素，给其children放匹配到的各种子元素，直到遇到结束标签或开始标签，遇到了开始标签的时候就又重新给currentParent赋值了，那么匹配到结束标签是如何确定父子关系的呢？也就是说每一次匹配到开始标签都是新的开始，那么遇到结束标签就需要确定父子关系了，将该元素和该元素匹配到的所有的子元素放到该元素的父元素中，用定义的stack栈结构的数组确定父子关系
    // 将开始标签存放到栈中。

    stack$1.push(currentParent);
  } // 匹配到文本


  function chars(text) {
    // console.log('文本是', text)
    text = text.replace(/\s/g, ''); // 匹配到文本标签, 就把text放到当前父元素的孩子中。

    if (text) {
      currentParent.children.push({
        text: text,
        type: TEXT_TYPE
      });
    }
  } // 匹配到结束标签
  // <div><p>  [div, p]


  function end(tagName) {
    // console.log('结束标签', tagName)
    // 将该标签从栈中移出
    var element = stack$1.pop(); // 我要标识当前这个p是属于这个div的儿子的

    currentParent = stack$1[stack$1.length - 1]; // 先看匹配到的end标签是否有父亲。
    // 确定树的父子关系。将该元素和该元素匹配到的所有的子元素放到该元素的父元素中

    if (currentParent) {
      element.parent = currentParent;
      currentParent.children.push(element);
    }
  } // 算法题：怎样判断标签都被 正常闭合了，定义一个栈结构[]往里面放开始标签[div, p, span], 当匹配到结束标签，拿出栈中的最后一个进行对比，如果相同，将栈的最后一个删除，如果匹配成功，则是正常的情况，其他的则不是正常的情况， 也是用这个来形成ast语法树，形成父子关系。


  function parseHTML(html) {
    // 每次调用parseHTML都会产生一颗新的树， 所以将一下变量放到函数体中。
    root = null; //  ast语法树的树根

    stack$1 = [];
    /*
        核心规则就是不停的拿正则去匹配template字符串，每匹配到一块就把字符串中匹配到的截取掉 
     */

    var _loop = function _loop() {
      var textEnd = html.indexOf('<');

      if (textEnd === 0) {
        // 必须是首位代表匹配到了< 
        // 如果进来了，那么这能是开始标签也可能是结束标签
        var startTagMatch = parseStartTag(); // 通过这个方法获取到匹配的结果，tagName，attrs

        if (startTagMatch) {
          start(startTagMatch.tagName, startTagMatch.attrs); // break

          return "continue"; // 如果开始标签匹配完毕后，继续下一次匹配
        } // 尝试匹配结束标签


        var endTagMatch = html.match(endTag);

        if (endTagMatch) {
          advance(endTagMatch[0].length);
          end(endTagMatch[1]);
          return "continue";
        }
      } // 开始标签结束之后，应该尝试再去匹配: 比如<div>xxxxx <p> ，两个标签之间的字符。


      var text = void 0;

      if (textEnd >= 0) {
        text = html.substring(0, textEnd);
        advance(text.length);
        chars(text);
      } // 截取匹配的标签


      function advance(n) {
        html = html.substring(n);
      }

      function parseStartTag() {
        var start = html.match(startTagOpen);

        if (start) {
          var match = {
            tagName: start[1],
            // 匹配到第一个分组， 在这里就是这个标签名。
            attrs: []
          }; // console.log(start)

          advance(start[0].length); // start[0] 代表匹配到的结果

          var _end, attr; // 如果开始标签中有>， 并且还能匹配到属性的话那么就开始解析属性


          while (!(_end = html.match(startTagClose)) && (attr = html.match(attribute))) {
            advance(attr[0].length); // 将属性去掉

            match.attrs.push({
              name: attr[1],
              value: attr[3] || attr[4] || attr[5]
            });
          }

          if (_end) {
            advance(_end[0].length); // 将开始标签的> 去掉
            // console.log(html)

            return match;
          }
        }
      }
    };

    while (html) {
      var _ret = _loop();

      if (_ret === "continue") continue;
    }

    return root;
  }

  var defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;

  function genProps(attrs) {
    var str = '';
    attrs.forEach(function (item) {
      // 暂时考虑这一种情况
      var name = item.name,
          value = item.value;

      if (name === 'style') {
        var obj = {};
        value.split(';').forEach(function (st) {
          var _st$split = st.split(':'),
              _st$split2 = _slicedToArray(_st$split, 2),
              name = _st$split2[0],
              value = _st$split2[1];

          obj[name] = value;
        });
        str += "".concat(name, ":").concat(JSON.stringify(obj), ",");
      } else {
        str += "".concat(name, ":").concat(JSON.stringify(value), ",");
      }
    });
    return "{".concat(str.slice(0, -1), "}");
  }

  function genChildren(el) {
    var children = el.children;

    if (children && children.length > 0) {
      return "".concat(children.map(function (c) {
        return gen(c);
      }).join(','));
    } else {
      return false;
    }
  } // 传过来chilren []中一个个的item


  function gen(node) {
    if (node.type === 1) {
      return generate(node);
    } else {
      // 这里只能抄了，都是正则匹配问题
      var text = node.text;
      var tokens = [];
      var match, index;
      var lastIndex = defaultTagRE.lastIndex = 0;

      while (match = defaultTagRE.exec(text)) {
        index = match.index;

        if (index > lastIndex) {
          tokens.push(JSON.stringify(text.slice(lastIndex, index)));
        }

        tokens.push("_s(".concat(match[1].trim(), ")"));
        lastIndex = index + match[0]; //  每次的偏移量 决定了偏移到的位置,
      }

      if (lastIndex < text.length) {
        tokens.push(JSON.stringify(text.slice(lastIndex, index)));
      }

      return "_v(".concat(tokens.join('+'), ")");
    }
  }

  function generate(el) {
    var children = genChildren(el);
    var code = "_c(\"".concat(el.tag, "\",").concat(el.attrs.length ? genProps(el.attrs) : 'undefined').concat(children ? ",".concat(children) : '', ")");
    return code;
  }

  function compileToFunction(template) {
    // 1） 解析html字符串，将html字符串 =》 ast语法树
    var root = parseHTML(template); // console.log(root)

    /* 
        <div id="app"><p>hello {{name}}</p> hello</div>
        // 把模版变成ast， 将ast语法树变成render函数
        _c("div", {id: app}, _c("p", undefined, _v('hello' + _s(name))), _v('hello'))
    */

    var code = generate(root); // console.log(code)
    // 所有的模板引擎实现 都需要 new Function + with ，with改变作用域

    var renderFn = new Function("with(this){ return ".concat(code, "}")); // 将ast语法树变成render函数

    return renderFn; // 下一步就是将函数执行，然后将函数中数据渲染到页面上。
  }

  var id$1 = 0;
  var Watcher = /*#__PURE__*/function () {
    function Watcher(vm, exprOrFn, callback, options) {
      _classCallCheck(this, Watcher);

      this.vm = vm;
      this.callback = callback;
      this.options = options;
      this.id = id$1++;
      this.getter = exprOrFn; // 将内部传递过来的函数放到getter属性上，并不执行，是因为要做其他的逻辑

      this.get();
    }

    _createClass(Watcher, [{
      key: "get",
      value: function get() {
        pushTarget(this); // 没渲染之前，把当前watcher存起来。
        // 要做的就是数据改变，自动执行渲染watcher

        this.getter(); // 进行渲染, 渲染需要进行取值。

        popTarget(); // 渲染之后移除watcher
      }
    }, {
      key: "update",
      value: function update() {
        this.get();
      }
    }]);

    return Watcher;
  }();

  function patch(oldVnode, vnode) {
    // 在第一次渲染的时候oldVnode一定是一个真实的dom元素。
    // 所以需要判断是更新还是渲染
    var isRealElement = oldVnode.nodeType; // 如果是初渲染

    if (isRealElement) {
      var oldElm = oldVnode; // div id="app"

      var parentElm = oldElm.parentNode; // body

      var el = createElm(vnode);
      parentElm.insertBefore(el, oldElm.nextSibling); // 通过虚拟dom创建的真实dom插入到oldElm元素的后面。

      parentElm.removeChild(oldElm); // 将虚拟dom创建出的真实dom通过oldElm的父亲扔到oldElm的父亲中，然后该父亲将oldElm删除

      return el;
    } // 递归创建真实节点。替换掉老的节点

  } // 根据虚拟节点创建真实的节点

  function createElm(vnode) {
    var tag = vnode.tag,
        children = vnode.children,
        key = vnode.key,
        data = vnode.data,
        text = vnode.text; // 是标签就创建标签

    if (typeof tag === 'string') {
      vnode.el = document.createElement(tag); // 把属性更新到元素上

      updateProperties(vnode);
      children.forEach(function (c) {
        vnode.el.appendChild(createElm(c)); // 递归创建真实dom
      });
    } else {
      // // 如果不是标签就是文本
      // 虚拟dom上映射着真实dom， 方便后续操作更新
      vnode.el = document.createTextNode(text);
    }

    return vnode.el;
  } // 将属性更新到元素上，上面那个方式只是创建结构


  function updateProperties(vnode) {
    var newProps = vnode.data;
    var el = vnode.el;

    for (var key in newProps) {
      if (key === 'style') {
        for (var styleName in newProps.style) {
          el.style[styleName] = newProps.style[styleName];
        }
      } else if (key === 'class') {
        el.className = newProps["class"];
      } else {
        el.setAttribute(key, newProps[key]);
      }
    }
  }

  function lifecycleMixin(Vue) {
    Vue.prototype._update = function (vnode) {
      var vm = this;
      vm.$el = patch(vm.$el, vnode); // 需要用虚拟节点创建出真实节点 替换掉 真实的$el
    };
  }
  function mountedComponent(vm, el) {
    var options = vm.$options;
    vm.$el = el; // 代表的是真实的dom元素
    // 渲染页面之前

    callhook(vm, 'beforeMount'); // 渲染页面的函数，渲染函数， 更新组件的函数

    var updateComponent = function updateComponent() {
      // 无论渲染还是更新都会调用此方法
      vm._update(vm._render()); // _render方法返回的是虚拟dom。_update是通过虚拟dom创建出真实的dom。

    }; // 渲染watcher   每个组件都有一个watcher


    new Watcher(vm, updateComponent, function () {}, true); // true代表此Watcher是渲染Watcher。 回调是通知谁，这里是渲染Watcher不需要通知谁。
    // 渲染之后

    callhook(vm, 'mounted');
  } // 发布的过程， 刚才订阅了一个个的生命周期，现在开始发布

  function callhook(vm, hook) {
    var handlers = vm.$options[hook];

    if (handlers && Array.isArray(handlers)) {
      for (var i = 0; i < handlers.length; i++) {
        handlers[i].call(vm);
      }
    }
  }

  function initMinix(Vue) {
    // 初始化流程
    Vue.prototype._init = function (options) {
      // 数据的劫持
      var vm = this; // 在vue中使用this.$options 指代的就是用户传递的属性。
      // vm.$options = options // 将用户传过来的 和 全局的Vue.options进行合并。

      vm.$options = mergeOptions(vm.constructor.options, options); // console.log(vm.$options)

      callhook(vm, 'beforeCreate'); // 初始化状态

      initState(vm); // 这个比较重要的处理需要单独拆分出一个文件

      callhook(vm, 'created'); // 如果用户传入了el属性，需要将页面渲染出来
      // 如果用户传入el，就要实现挂载流程。 

      if (vm.$options.el) {
        vm.$mount(vm.$options.el);
      }
    };

    Vue.prototype.$mount = function (el) {
      var vm = this;
      el = document.querySelector(el);
      var options = vm.$options; // 默认会先查找有没有render函数，没有render会采用template， template也没有就用el中的内容

      if (!options.render) {
        // 对模版进行编译
        var template = options.template;

        if (!template && el) {
          template = el.outerHTML;
        }

        var render = compileToFunction(template); // render函数返回的是虚拟dom

        options.render = render; // console.log(template)
      } // 使用render函数， 渲染/挂载这个组件


      mountedComponent(vm, el);
    };
  }

  /* 
      vnode和ast的区别，大概是ast只能对 语法进行描述，但是vnode可以进行处理包装，比如事件，@click=“clickHandler"， ast只能对这种结构进行描述，但是vnode可以将事件处理好，放到真实dom上。vnode可以进行包转扩展。但ast只能固有化表示。
  */
  function createElement(tag) {
    var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var key = data.key;

    if (key) {
      delete data.key;
    }

    for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      children[_key - 2] = arguments[_key];
    }

    return vnode(tag, data, key, children, undefined);
  }
  function createTextNode(text) {
    return vnode(undefined, undefined, undefined, undefined, text);
  }

  function vnode(tag, data, key, children, text) {
    return {
      tag: tag,
      data: data,
      key: key,
      children: children,
      text: text
    };
  }

  function renderMixin(Vue) {
    // _c创建元素的虚拟节点
    // _v 创建文本的虚拟节点
    // _s JSON.stringify
    Vue.prototype._c = function () {
      return createElement.apply(void 0, arguments); // 创建元素
    };

    Vue.prototype._v = function (text) {
      return createTextNode(text);
    };

    Vue.prototype._s = function (val) {
      return val == null ? '' : _typeof(val) === 'object' ? JSON.stringify(val) : val;
    };

    Vue.prototype._render = function () {
      var vm = this;
      var render = vm.$options.render;
      var vnode = render.call(vm); // 去实例上去取值

      return vnode;
    };
  }

  function initGlobalAPI(Vue) {
    // 整合了所有的全局相关的内容
    Vue.options = {}; // 这个方法的作用是可以合并一些全局api， 比如生命周期，外面传入一个生命周期函数，不会覆盖内部的。而是对生命周期进行合并

    Vue.mixins = function (mixin) {
      // 这个this肯定指的是Vue
      this.options = mergeOptions(this.options, mixin);
    }; // 生命周期的合并  把所有同名的生命周期合并成一个数组 [beforeCreate, beforeCreate], 先放进去的先执行。


    Vue.mixins({
      a: 1,
      created: function created() {// console.log('first created')
      },
      beforeCreate: function beforeCreate() {// console.log('first beforeCreate')
      },
      mounted: function mounted() {// console.log('first mounted')
      }
    });
    Vue.mixins({
      b: 2,
      beforeCreate: function beforeCreate() {// console.log('second beforeCreate')
      },
      mounted: function mounted() {// console.log('second mounted')
      },
      updated: function updated() {}
    });
  }

  function Vue(options) {
    // 进行vue初始化
    // console.log(options)
    // 进行vue的初始化流程。
    this._init(options);
  } // 通过引入文件的方式， 给Vue原形上添加方法
  // 将复杂的流程单独拆分到不同的文件中。流程清晰。


  initMinix(Vue);
  renderMixin(Vue);
  lifecycleMixin(Vue); // 初始化全局 API

  initGlobalAPI(Vue);

  return Vue;

})));
//# sourceMappingURL=vue.js.map
