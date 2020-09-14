import {initMinix} from './init'
import { renderMixin } from './render'
import { lifecycleMixin } from './lifecycle'
import { initGlobalAPI } from './initGlobalAPI/index'
function Vue(options) {
    // 进行vue初始化
    // console.log(options)
    // 进行vue的初始化流程。
    this._init(options)
}
// 通过引入文件的方式， 给Vue原形上添加方法
// 将复杂的流程单独拆分到不同的文件中。流程清晰。
initMinix(Vue)
renderMixin(Vue)
lifecycleMixin(Vue)



// 初始化全局 API
initGlobalAPI(Vue)

export default Vue