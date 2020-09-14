import { parseHTML } from './parse-html.js'
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g

function genProps(attrs) {
    let str = ''
    attrs.forEach(item => {
        // 暂时考虑这一种情况
        const { name, value } = item
        if (name === 'style') {
            let obj = {}
            value.split(';').forEach(st => {
                let [name, value] = st.split(':')
                obj[name] = value
            })
            str += `${name}:${JSON.stringify(obj)},`
        } else {
            str += `${name}:${JSON.stringify(value)},`
        }
    });
    return `{${str.slice(0, -1)}}`
}

function genChildren(el) {
    let children = el.children
    if (children && children.length > 0) {
        return `${children.map(c => gen(c)).join(',')}`
    } else {
        return false
    }
}

// 传过来chilren []中一个个的item
function gen(node) {
    if (node.type === 1) {
        return generate(node)
    } else {
        // 这里只能抄了，都是正则匹配问题
        let text = node.text
        let tokens = []
        let match, index;
        let lastIndex = defaultTagRE.lastIndex = 0
        while (match = defaultTagRE.exec(text)) {
            index = match.index
            if (index > lastIndex) {
                tokens.push(JSON.stringify(text.slice(lastIndex, index)))
            }
            tokens.push(`_s(${match[1].trim()})`)

            lastIndex = index + match[0] //  每次的偏移量 决定了偏移到的位置,
        }

        if (lastIndex < text.length) {
            tokens.push(JSON.stringify(text.slice(lastIndex, index)))
        }

        return `_v(${tokens.join('+')})`
    }
}

function generate(el) {
    let children = genChildren(el)
    let code = `_c("${el.tag}",${
        el.attrs.length ? genProps(el.attrs) : 'undefined'}${
        children ? `,${children}` : ''})`
    return code
}

export function compileToFunction(template) {
    // 1） 解析html字符串，将html字符串 =》 ast语法树
    let root = parseHTML(template)
    // console.log(root)
    /* 
        <div id="app"><p>hello {{name}}</p> hello</div>
        // 把模版变成ast， 将ast语法树变成render函数
        _c("div", {id: app}, _c("p", undefined, _v('hello' + _s(name))), _v('hello'))
    */
    let code = generate(root)
    // console.log(code)
    // 所有的模板引擎实现 都需要 new Function + with ，with改变作用域
    let renderFn = new Function(`with(this){ return ${code}}`);

    // 将ast语法树变成render函数
    return renderFn  // 下一步就是将函数执行，然后将函数中数据渲染到页面上。
}

/*
    首先将拿到的template字符串转成 ast语法树
 */
// template 字符串
/*  
<div id="app">
    <p>{{name}}</p>
</div> 
 */
// 转换成这个样子的ast抽象语法树
let root1cc = {
    tag: 'div',
    attrs: [{
        name: 'id', value: 'app'
    }],
    parent: null,
    type: 1,
    children: [{
        tag: 'p',
        attrs: [],
        // parent: root, // error so ... comment
        type: 1,
        children: [{
            text: 'hello',
            type: 3
        }]
    }]
}