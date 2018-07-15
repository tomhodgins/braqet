const {parse, html} = require('../index.js')

let example = `

  [[[["p", 0, "I come last"]]]]

  [["p", {"class": "example"}, "Hello World"]]

  ["p", 0, "I", " ", "come", " ", "first"]

`

console.log(

  html(parse(example))

)