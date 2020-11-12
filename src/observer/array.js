
// 我要重写数组的那7个方法， push、shift、unshift、pop、reverse、sort、splice  会导致数组本身发生变化

let oldArrayMethods = Array.prototype
export const arrayMethods = Object.create(oldArrayMethods)
/*
arrayMethods = {
    constructor: ƒ Array()
    pop: ƒ pop()
    push: ƒ push()
    reverse: ƒ reverse()
    shift: ƒ shift()
    slice: ƒ slice()
    sort: ƒ sort()
    splice: ƒ splice()
    unshift: ƒ unshift()
    ...
}
  当我们定义的数据是数组的时候调用这些方法会到这里来找，这么做的好处是我们掌握了调用这些方法的控制权，可以对这个对象中的方法进行重写。 而且对于其他的方法并不影响其原有逻辑。  记住：拿到了控制权就可以加入自己的逻辑
 */

/* 
    我们的目的是什么？
    是让用户 插入/修改的值也获取数据相应的效果
    但是我们还需要调用数组原有的方法
    我们 需要在这调用这七个方法中加入自己的逻辑处理。然后处理完毕在调用数组原有的方法
*/

const methods = [
  "push",
  "shift",
  "unshift",
  "pop",
  "reverse",
  "sort",
  "splice"
]

methods.forEach(method => {
  //  定义方法重写数组原有的方法
  // 重新定义arrayMethods中的方法
  arrayMethods[method] = function (...args) {

    let inserted; // 当前用户插入的元素
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice':  // splice 有删除、修改、新增的功能。我们需要对新增/修改的数据进行劫持。
        inserted = args.slice(2)
        break
    }
    this.__ob__.observerArray(inserted)
    // 调用原生方法走原来的逻辑
    let result = Array.prototype[method].apply(this, args)
    // 派发更新
    this.__ob__.dep.notify()
    return result
  }

})
