import { initState } from './state'
import { compileToFunction } from './compiler/index.js' // 模版编译成render函数
import {mountedComponent, callhook} from './lifecycle' // 执行render函数挂载这个组件

import {mergeOptions} from './utils/index'
export function initMinix(Vue) {
    // 初始化流程
    Vue.prototype._init = function(options) {
        // 数据的劫持
        const vm = this // 在vue中使用this.$options 指代的就是用户传递的属性。
        // vm.$options = options // 将用户传过来的 和 全局的Vue.options进行合并。
        vm.$options = mergeOptions(vm.constructor.options, options)
        // console.log(vm.$options)
        callhook(vm,'beforeCreate')
        // 初始化状态
        initState(vm) // 这个比较重要的处理需要单独拆分出一个文件
        callhook(vm,'created')

        // 如果用户传入了el属性，需要将页面渲染出来
        // 如果用户传入el，就要实现挂载流程。 
        if(vm.$options.el) {
            vm.$mount(vm.$options.el)
        }
    }

    Vue.prototype.$mount = function(el) {
        const vm = this
        el = document.querySelector(el)
        const options = vm.$options
        // 默认会先查找有没有render函数，没有render会采用template， template也没有就用el中的内容
        if(!options.render) {
            // 对模版进行编译
            let template = options.template
            if(!template && el) {
                template = el.outerHTML
            }
            const render = compileToFunction(template) // render函数返回的是虚拟dom
            options.render = render
            // console.log(template)
        }

        // 使用render函数， 渲染/挂载这个组件
        mountedComponent(vm, el) 
    }
}