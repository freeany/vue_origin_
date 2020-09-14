// 把data中的数据 都使用Object.defineProperty 重新定义es5
// Object.defineProperty 不能肩痛ie8 及其一下，也没有什么polyfile
import { isObject } from '../utils/index'
import { arrayMethods } from './array'
import { def } from '../utils/index'
import Dep from './dep'
class Observer {
    constructor(value) {
        // vue如果数据的层次过多，需要递归的去解析对象中的属性，依次增加set和get方法
        // 对数组进行单独的监测
        // 给value对象加上一个ob属性，记录下当前的observer对象
        def(value, '__ob__', this)
        if(Array.isArray(value)) {
            // 如果是数组的话并不会对索引进行监测，因为会导致性能问题
            // 前端开发一般很少会操作索引， 一般会操作数组的 一些方法

            // 重写这个数组的原型方法
            value.__proto__ = arrayMethods
            // 如果数组里放的是对象我再监测
            this.observerArray(value)
        }else {
            this.walk(value)
        }
    }
    observerArray(value) {
        for(let i =0;i<value.length;i++) {
            observe(value[i]) // 劫持数组中的每一项。
        }
    }
    walk(data) {
        let keys = Object.keys(data)
        for(let i = 0;i<keys.length;i++) {
            let key = keys[i]
            let value = data[key]
            defineReactive(data, key, value)
        }
    }
}

/* 
    正常情况下对一个对象进行取值和赋值操作  是引擎帮我们完成的，我们什么也做不了， 
    但是对象经过defineProperty数据劫持后，我们就可以在取值和赋值的内部进行一些操作。
*/
function defineReactive(data, key, value) {
    let dep = new Dep()
    observe(value) // 进行递归劫持。对深层次(两层以上)的对象进行递归查询其属性并进行数据劫持。
    Object.defineProperty(data, key, {
        get() {     // 获取值时的操作
            // 每个属性都对应着自己的wathcer
            if(Dep.target) { // 是否经过渲染watcher
                // 把当前wathcer 和 Dep建立一个联系
                dep.depend() /// 意味着我要将w渲染athcher存起来
            }
            return value
        },
        set(newValue) { // 设置值时的操作
            if(newValue === value) return
            // vm._data.obj = {cc: 123}
            // 上一行说明了，如果用户直接赋值了一个对象的话，需要对这个对象进行劫持。
            value = newValue

            dep.notify() // 使用notify进行更新。
        }
    })
}

export function observe(data) {
    // console.log(data)
    if(!isObject(data))  {
        // 抛出错误信息
        // console.error('请返回对象')
        return
    }

    return new Observer(data)   // 用来对数据进行监测
}