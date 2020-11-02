const compiler = require('vue-template-compiler')
let r = compiler.compile('<div style="color: red" id=app>hello {{name}}</div>')
console.log(r)

function render() {
    with (this) {
        return _c(
            "div",
            { id: app, id2: app2, style: { "color": "red", " background": " blue" } },
            _c(
                "p",
                undefined,
                _v("姓名：" + _s(name))
            ),
            _c(
                "span",
                undefined,
                _v("年龄：" + _s(age))
            )
        )
    }
}