import { pushTarget, popTarget } from './dep'
let id = 0
export class Watcher {
    constructor(vm,exprOrFn,callback,options){
        this.vm = vm
        this.callback = callback
        this.options = options

        this.id = id++
        this.getter = exprOrFn // 将内部传递过来的函数放到getter属性上，并不执行，是因为要做其他的逻辑
        // 定义set集合，看wathcer里有没有放过这个dep
        this.depsId = new Set()
        this.deps = []
        this.get()
    }
    // wathcer里不能放重复的dep， dep里不能放重复的watcher
    addDep(dep) {
        let id = dep.id // 拿到dep中唯一的id值。
        if(!this.depsId.has(id)) {
            this.depsId.add(id)
            // 把dep对象存进去
            this.deps.push(dep)
            dep.addSubs(this) // 将当前的watcher存到dep中
        }
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