### vue渐进式框架

- 我们可以使用局部功能也可以使用完整功能
- vue的响应式原理 + vue的组件化功能 + vue-router + vuex + vue-cli



## 模版的采用方式

- vue两种模式。 full-with-complier / runtime
  - full-with-compiler 是会对parseHtml然后转换成render函数
  - runtime 是自己写的render函数
  - 虚拟dom的生成只认render函数。
- vue的使用模版的顺序
  - render > template > el

### 模版语法

- 模版语法 会在当前的vue实例上进行取值
- 表达式只能存放   有返回值的结果
  - `{{name}} / {{ 1+ 2}} / {{ fn() }} / {{ true ? 1 : 2 }}`

## 响应式的规则

- 对象中不存在的属性，如果新增的话不能渲染视图， 内部会采用defineProperty重新定义属性 getter 和 setter
- 数组只能通过改变数组的七个方法来实现视图， 不能使用索引长度
  - vm.$set  对于对象而言是为新增的属性添加getter和setter方法，对于数组而言 采用了splice方法
- Vue3.0 使用了proxy来实现了代理，不需要一上来就进行递归（性能好，但是兼容性差）



## 实例方法

- `vm.$mount('#app')`  为什么会有这个api呢？
- 因为有些组件可能我不希望挂载到app的节点上。  可以自定义挂载点。
  - 这个api是在  render/template/el的优先级的后面。
  - 比如做一些弹框组件
- v m.$options // 用户传入的所有属性
- vm.$data // 用户传入的data
- vm.$watch('msg', (newVal, oldVal) => {})   
  - 用户自定义wathcer。



## 指令

> 指令如果有值，那么其对应的值都是变量

- v-once   - 渲染一次之后标记为静态节点，稍后渲染时，不会重新的渲染，因为有缓存了。

​	`<div v-once>{{name}}</div>`	

- v-html  - 等同的是innerHtml， 需要对内容进行严格把控，不要相信用户输入的内容

​	`<div v-html="html"></div>`

- v-if v-else-if v-else

  - 会被编译成三元表达式。 操作的是dom

- v-show

  - **会被编译成指令** 使用display: none 来控制是否显示
  - display:none / opacity: 0 / visibility: hidden 的区别
    - 前者是直接不显示不占位置，后两者是不显示但是占位置
    - opacity 是透明度为0但是事件仍然有效，visibility事件也无效了。

- v-for

  - 问：关于VUE中v-for循环的dom使用ref获取不到问题

  - 答：vue组件初始化到第一次渲染完成，也就是mounted周期里面，只是把组件模板的静态数据渲染了，动态绑定的Dom，并没有初始化，所以我们在mounted周期里面操作获取dom是获取不到的。

    - 解决方案：把this.$nextTick放在你获取到v-for绑定的数据并赋值之后，也就是触发响应式更新之后在操作。

  - v-for和v-if 优先级的问题

    - v-for的优先级比v-if的优先级要高。 否则渲染的时候会在循环列表的时候对每一项进行v-if的判断。会有性能问题。
    - 解决： 使用计算属性解决这个问题。 

    - key的问题： 尽量不要使用索引作为key。（尤其是经常操作的列表）

      ```html
      <li key="0">苹果</li>
      <li key="1">橘子</li>
      <li key="2">香蕉</li>
      如果我过会需要对这个数组进行倒序
      vue会再重新渲染的时候进行 对 key值进行比对， 如果索引相同，那么他会认为这两个节点相同，节点相同的情况下，vue发现里面的内容(苹果)不对，他会将苹果替换成橘子。橘子ok， 把香蕉变成苹果。产生了两次的dom(删除/创建)操作，这是在key值使用索引的情况下。
      
      vue提倡就地复用的策略
      如果我们使用了具有唯一标识作为key。
      <li key="pg">苹果</li>
      <li key="jz">橘子</li>
      <li key="xj">香蕉</li>
      倒序之后
      <li key="xj">香蕉</li>
      <li key="jz">橘子</li>
      <li key="pg">苹果</li>
      vue会去当前v-for中的列表中去找key，发现xj对应的节点，将节点进行移动。减少了dom的操作。
      key是用来做节点对比。
      如果key相同的话(用索引的话key都是相同的)，但是值不一样，会删除/创建
      如果key不同， 将去找key，如果找到了，然后移动就可以了。							
      ```

      

## 组件(重要)

> vue是组件化开发，也是组件化渲染， 什么是组件化渲染？ 就是数据变化了，只更新依赖于该数据的组件，因为每个组件都有一个单独的watcher。

### 组件通信

​	v-model 不全等于 :value + @input

如果输入中文，v-model会在输入完成之后 进行赋值操作，而@input 输入中文的过程中，其拼音就会被赋值了。

对于原生标签，v-model内部会对输入法进行处理。 而且不同的标签解析出的结果不一样。

### ref

> ref放到组件上就是组件的实例，放到dom上就是该dom的引用。

## test用例

如果要看一个语法最后会被编译成什么，可以使用这个包

```js
let compiler = require('vue-template-compiler')

let t = `<div v-if="true">hello</div>
        <div v-else>world</div>`

console.log(compiler.compile(t).render)
```



