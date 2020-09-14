import { observe } from './observer/index.js'

// 取值时，进行代理，用户更方便
function proxy(vm, source, key) {
    Object.defineProperty(vm, key, {
        get() {
            return vm[source][key]
        },
        set(newValue) {
            vm[source][key] = newValue
        }
    })
}
export function initState(vm) {
    const opts = vm.$options

    // vue 的数据来源  属性，方法，数据，计算属性，watch
    if(opts.props) {
        initProps(vm)
    }
    if(opts.methods) {
        initMethods(vm)
    }
    if(opts.data) {
        initData(vm)
    }
    if(opts.computed) {
        initComputed(vm)
    }
    if(opts.watch) {
        initWatch(vm)
    }
}

function initProps(vm) {

}

function initMethods(vm) {
    
}

function initData(vm) {
    // console.log(vm.$options.data)
    // 数据的初始化工作
    let data = vm.$options.data // 用户传递的data
    data = vm._data = typeof data === 'function' ? data.call(vm) : data

    // 为了让用户更好的使用，我希望可以直接vm.xxx
    for(let key in data) {
        proxy(vm, '_data', key)
    }
    // 对对象进行数据接触， 用户改变了数据， 页面需要得到通知并刷新页面
    // 这就是mvvm模式，数据变化可以驱动视图变化
    // Object.defineProperty()  给属性添加get和set方法
    observe(data)
}

function initComputed(vm) {
    
}

function initWatch(vm) {
    
}