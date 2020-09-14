import { mergeOptions } from '../utils/index'
export function initGlobalAPI(Vue) {
    // 整合了所有的全局相关的内容
    Vue.options = {}

    // 这个方法的作用是可以合并一些全局api， 比如生命周期，外面传入一个生命周期函数，不会覆盖内部的。而是对生命周期进行合并
    Vue.mixins = function(mixin) {
        // 这个this肯定指的是Vue
        this.options = mergeOptions(this.options, mixin)
    }

    // 生命周期的合并  把所有同名的生命周期合并成一个数组 [beforeCreate, beforeCreate], 先放进去的先执行。
    Vue.mixins({
        a: 1,
        created() {
            // console.log('first created')
        },
        beforeCreate() {
            // console.log('first beforeCreate')
        },
        mounted() {
            // console.log('first mounted')
        },
    })

    Vue.mixins({
        b: 2,
        beforeCreate() {
            // console.log('second beforeCreate')
        },
        mounted() {
            // console.log('second mounted')
        },
        updated() {
            
        },
    })
}