export function patch(oldVnode, vnode) {
    // 在第一次渲染的时候oldVnode一定是一个真实的dom元素。
    // 所以需要判断是更新还是渲染
    const isRealElement = oldVnode.nodeType

    // 如果是初渲染
    if (isRealElement) {
        const oldElm = oldVnode // div id="app"
        const parentElm = oldElm.parentNode // body

        let el = createElm(vnode)
        parentElm.insertBefore(el, oldElm.nextSibling) // 通过虚拟dom创建的真实dom插入到oldElm元素的后面。
        parentElm.removeChild(oldElm)
        // 将虚拟dom创建出的真实dom通过oldElm的父亲扔到oldElm的父亲中，然后该父亲将oldElm删除

        return el
    }

    
    // 递归创建真实节点。替换掉老的节点
}

// 根据虚拟节点创建真实的节点
function createElm(vnode) {
    let { tag, children, key, data, text } = vnode
    // 是标签就创建标签
    if (typeof tag === 'string') {
        vnode.el = document.createElement(tag)
        // 把属性更新到元素上
        updateProperties(vnode)
        children.forEach(c => {
            vnode.el.appendChild(createElm(c))// 递归创建真实dom
        })

    } else { // // 如果不是标签就是文本
        // 虚拟dom上映射着真实dom， 方便后续操作更新
        vnode.el = document.createTextNode(text)
    }
    return vnode.el
}

// 将属性更新到元素上，上面那个方式只是创建结构
function updateProperties(vnode) {
    let newProps = vnode.data;
    let el = vnode.el;
    for (let key in newProps) {
        if (key === 'style') {
            for (let styleName in newProps.style) {
                el.style[styleName] = newProps.style[styleName];
            }
        } else if (key === 'class') {
            el.className = newProps.class;
        } else {
            el.setAttribute(key, newProps[key]);
        }
    }
}