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
        // 如果在页面中多次使用了变量，那么会存放重复的watcher， 所以需要将Dep与watcher进行相互记忆。
        // this.subs.push(Dep.target) // 不合适
        Dep.target.addDep(this) // 记住当前
    }
    addSubs(watcher) {
        this.subs.push(watcher)
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