const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`; // abc-aaa  // 命名空间
const qnameCapture = `((?:${ncname}\\:)?${ncname})`; // <aaa:asdads>  ?: 代表匹配不捕获
const startTagOpen = new RegExp(`^<${qnameCapture}`); // 标签开头的正则 捕获的内容是标签名
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); // 匹配标签结尾的 </div>
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性的
const startTagClose = /^\s*(\/?)>/; // 匹配标签结束的 >  也能是自闭合标签，所以 />

let root = null
let currentParent // 表示当前父亲是谁
let stack = []
const ELEMENT_TYPE = 1
const TEXT_TYPE = 3

function createASTElement (tagName, attrs) {
  return {
    tag: tagName,
    type: ELEMENT_TYPE,
    children: [],
    attrs,
    parent: null
  }
}

// 在开发中不会使用模版。会降低性能
// 匹配到开始标签
function start (tagName, attrs) {
  // 匹配到开始标签，就创建一个ast元素。
  // console.log('开始标签', tagName, '属性', attrs)
  let element = createASTElement(tagName, attrs)
  if (!root) {
    root = element  // root做为一个引用变量，只有在root:null的时候可以被赋值
  }
  currentParent = element // 其他的情况直接将 当前匹配到的element 赋值给currentParent， 不会影响到root了。也就是说root只有一次机会被改变，就是root为null的时候。每匹配到一次开始标签都是一次新的开始。这个匹配到的开始标签就暂时作为了顶层元素，给其children放匹配到的各种子元素，直到遇到结束标签或开始标签，遇到了开始标签的时候就又重新给currentParent赋值了，那么匹配到结束标签是如何确定父子关系的呢？也就是说每一次匹配到开始标签都是新的开始，那么遇到结束标签就需要确定父子关系了，将该元素和该元素匹配到的所有的子元素放到该元素的父元素中，用定义的stack栈结构的数组确定父子关系
  // 将开始标签存放到栈中。
  stack.push(currentParent)
}
// 匹配到文本
function chars (text) {
  // console.log('文本是', text)
  text = text.replace(/\s/g, '')
  // 匹配到文本标签, 就把text放到当前父元素的孩子中。
  if (text) {
    currentParent.children.push({
      text,
      type: TEXT_TYPE
    })
  }
}
// 匹配到结束标签
// <div><p>  [div, p]
function end (tagName) {
  // console.log('结束标签', tagName)
  // 将该标签从栈中移出
  let element = stack.pop()
  // 我要标识当前这个p是属于这个div的儿子的
  currentParent = stack[stack.length - 1] // 先看匹配到的end标签是否有父亲。
  // 确定树的父子关系。将该元素和该元素匹配到的所有的子元素放到该元素的父元素中
  if (currentParent) {
    element.parent = currentParent
    currentParent.children.push(element)
  }
}
// 算法题：怎样判断标签都被 正常闭合了，定义一个栈结构[]往里面放开始标签[div, p, span], 当匹配到结束标签，拿出栈中的最后一个进行对比，如果相同，将栈的最后一个删除，如果匹配成功，则是正常的情况，其他的则不是正常的情况， 也是用这个来形成ast语法树，形成父子关系。
export function parseHTML (html) {
  // 每次调用parseHTML都会产生一颗新的树， 所以将一下变量放到函数体中。
  root = null //  ast语法树的树根
  stack = []

  /*
      核心规则就是不停的拿正则去匹配template字符串，每匹配到一块就把字符串中匹配到的截取掉 
   */
  while (html) {
    let textEnd = html.indexOf('<')
    if (textEnd === 0) { // 必须是首位代表匹配到了< 
      // 如果进来了，那么这能是开始标签也可能是结束标签
      let startTagMatch = parseStartTag() // 通过这个方法获取到匹配的结果，tagName，attrs
      if (startTagMatch) {
        start(startTagMatch.tagName, startTagMatch.attrs)
        // break
        continue // 如果开始标签匹配完毕后，继续下一次匹配
      }
      // 尝试匹配结束标签
      let endTagMatch = html.match(endTag)
      if (endTagMatch) {
        advance(endTagMatch[0].length)
        end(endTagMatch[1])
        continue
      }
    }

    // 开始标签结束之后，应该尝试再去匹配: 比如<div>xxxxx <p> ，两个标签之间的字符。
    let text
    if (textEnd >= 0) {
      text = html.substring(0, textEnd)
      advance(text.length)
      chars(text)
    }
    // 截取匹配的标签
    function advance (n) {
      html = html.substring(n)
    }
    function parseStartTag () {
      let start = html.match(startTagOpen)
      if (start) {
        const match = {
          tagName: start[1], // 匹配到第一个分组， 在这里就是这个标签名。
          attrs: []
        }
        // console.log(start)
        advance(start[0].length) // start[0] 代表匹配到的结果


        let end, attr;
        // 如果开始标签中有>， 并且还能匹配到属性的话那么就开始解析属性
        while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
          advance(attr[0].length) // 将属性去掉
          match.attrs.push({
            name: attr[1],
            value: attr[3] || attr[4] || attr[5]
          })
        }
        if (end) {
          advance(end[0].length) // 将开始标签的> 去掉
          // console.log(html)
          return match
        }

      }
    }
  }
  return root
}
