/* 
    vnode和ast的区别，大概是ast只能对 语法进行描述，但是vnode可以进行处理包装，比如事件，@click=“clickHandler"， ast只能对这种结构进行描述，但是vnode可以将事件处理好，放到真实dom上。vnode可以进行包转扩展。但ast只能固有化表示。
*/

export function createElement(tag, data = {}, ...children) {
    let key = data.key
    if(key) {
        delete data.key
    }
    return vnode(tag, data, key, children, undefined)
}

export function createTextNode(text) {
    return vnode(undefined, undefined, undefined, undefined, text)
}

function vnode(tag, data, key, children, text) {
    return {
        tag,
        data,
        key,
        children,
        text
    }
}