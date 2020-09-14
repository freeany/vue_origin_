export function isObject(data) {
    return typeof data === 'object' && data !== null
}

export function def(data, key, value) {
    Object.defineProperty(data, key, {
        enumerable: false,
        configurable: false,
        value
    })
}

const LIFECYCLE_HOOKS = [
    'beforeCreate',
    'created',
    'beforeMount',
    'mounted',
    'beforeUpdate',
    'upadted',
    'beforeDestroy',
    'destroyed'
]
function mergeHook(parent, child) {
    if(child) { // 新的有
        if(parent) {  // 如果新的有老得也有
            return parent.concat(child)
        }else {
            return [child] // 首次肯定都没有，所以返回一个数组过去，所以下次的parent可以用concat方法。
        }
    }else { // 新的没有，老得有
        return parent
    }
}
let strats = {}
LIFECYCLE_HOOKS.forEach(hook => {
    strats[hook] = mergeHook
})
// 合并两个对象。使用Object。assign 或者 {...} 只会将后者中的相同key直接覆盖前者中的相同key。而这个是对对象中的key进行合并。不是直接覆盖。
// 都有同样的属性,且其值为基本数据类型，以child的为主， parent的扔掉
// 都有同样的属性,且其值为引用数据类型，将这两个对象合并，该引用数据类型中有相同的值仍然以上个条件为主。
export function mergeOptions(parent, child) {
    const options = {}
    
    // 需要对 parent对象进行遍历
    for(let key in parent) {
        mergeField(key)
    }
    // 也需要对child进行遍历
    for(let key in child) {
        // 如果合并过了(上面的走完了才会走到这)， 那么就不需要合并了
        if(!parent.hasOwnProperty(key)) {
            mergeField(key)
        }
    }
    // 默认的合并策略， 有些属性需要有特殊的合并方式，生命周期的合并
    function mergeField(key) {
        if(strats[key]) {
            return options[key] = strats[key](parent[key], child[key])
        }
        // 如果parent和child都是引用数据类型
        if(typeof parent[key] === 'object' && typeof child[key] === 'object') {
            options[key] = {
                ...parent[key],
                ...child[key]
            }
            // 如果儿子没有，那么就直接将parent的值放给options。
        } else if(child[key] == null) {
            options[key] = parent[key]
        }else {
            // 如果是不是上面的情况
            options[key] = child[key]
        }
    }
    return options
}