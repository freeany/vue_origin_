// dep存的是watcher。dep收集依赖。
/* 
    wathcer 和 dep的关系
    一个watcher 对应n个dep
    一个dep 对应多个watcher
*/
let id = 0
class Dep {
    constructor() {
        this.id = id++
        this.subs = []
    }
    depend() {
        this.subs.push(Dep.target)
    }

    notify() {
        this.subs.forEach(watcher => watcher.update())
    }

}

// 一个变量可能引用了多个watcher
let stack = []
export function pushTarget(watcher) {
    Dep.target = watcher // 将渲染watcher存放到Dep.target
    stack.push(watcher)
}

export function popTarget() {
    stack.pop()
    Dep.target = stack[stack.length-1]
}


export default  Dep