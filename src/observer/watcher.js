import { pushTarget, popTarget } from './dep'
let id = 0
export class Watcher {
    constructor(vm,exprOrFn,callback,options){
        this.vm = vm
        this.callback = callback
        this.options = options

        this.id = id++
        this.getter = exprOrFn // 将内部传递过来的函数放到getter属性上，并不执行，是因为要做其他的逻辑

        this.get()
    }
    get() {
        pushTarget(this)  // 没渲染之前，把当前watcher存起来。
        // 要做的就是数据改变，自动执行渲染watcher
        this.getter() // 进行渲染, 渲染需要进行取值。
        popTarget() // 渲染之后移除watcher

    }
    update() {
        this.get()
    }
}