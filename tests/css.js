const {parse, css} = require('../index.js')

let example = `

  ["*", "font-family: sans-serif"]

  [["html", "background: red"]]

  /* Q: Why does this background win? */
  [[["html", "background: purple"]]]

  ["html", "background: blue"]

  ["h1", "color: white"]

`

console.log(

  css(parse(example))

)