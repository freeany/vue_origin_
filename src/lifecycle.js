import { Watcher } from './observer/watcher'
import { patch } from './vdom/patch'

export function lifecycleMixin (Vue) {
  Vue.prototype._update = function (vnode) {
    const vm = this;
    vm.$el = patch(vm.$el, vnode); // 需要用虚拟节点创建出真实节点 替换掉 真实的$el

  }
}

export function mountedComponent (vm, el) {
  const options = vm.$options

  vm.$el = el  // 代表的是真实的dom元素

  // 渲染页面之前
  callhook(vm, 'beforeMount')

  // 渲染页面的函数，渲染函数， 更新组件的函数
  let updateComponent = () => {  // 无论渲染还是更新都会调用此方法
    vm._update(vm._render()) // _render方法返回的是虚拟dom。_update是通过虚拟dom创建出真实的dom。
  }

  // 渲染watcher   每个组件都有一个watcher
  new Watcher(vm, updateComponent, () => { }, true) // true代表此Watcher是渲染Watcher。 回调是通知谁，这里是渲染Watcher不需要通知谁。

  // 渲染之后
  callhook(vm, 'mounted')
}

// 发布的过程， 刚才订阅了一个个的生命周期，现在开始发布
export function callhook (vm, hook) {
  const handlers = vm.$options[hook]
  if (handlers && Array.isArray(handlers)) {
    for (let i = 0; i < handlers.length; i++) {
      handlers[i].call(vm)
    }
  }
}
