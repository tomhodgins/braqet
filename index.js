module.exports.parse = (string='') =>
  string
    .replace(/\/\*[^*]+\*\//g, '')
    .replace(/\n\n+/, '\n\n')
    .split('\n\n')
    .map(line => line.trim())
    .filter(block => block)
    .map(block => JSON.parse(block))
    .map(block => {
      const arr = flattenArray(block)
      return Object.assign({
        head: arr[0],
        tail: [...arr.slice(1)],
        depth: depth(block)
      })
    })

module.exports.css = (ast=[]) =>
  ast
    // Sort by nesting depth (shallow -> deep)
    .sort((a, b) => a.depth > b.depth)
    // Map head to selector, and join tail as declaration list
    .map(rule => `${rule.head} { ${rule.tail.join('; ')} }`)
    .join('\n')

module.exports.html = (ast=[]) => {

  const voidTags = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']

  const attributes = (attrs={}) =>
    Object.entries(attrs)
      .map(attr => ` ${attr[0]}="${attr[1]}"`)
      .join('')

  return ast
    // Sort by nesting depth (shallow -> deep)
    .sort((a, b) => a.depth > b.depth)
    // Map head to selector, tail[0] as attributes and tail[1+] as content
    .map(tag =>
      voidTags.includes(tag.head.toLowerCase())
      ? `<${tag.head}${attributes(tag.tail[0])}>${tag.tail.slice(1).join('')}`
      : `<${tag.head}${attributes(tag.tail[0])}>${tag.tail.slice(1).join('')}</${tag.head}>`
    )
    .join('\n')

}

const depth = (arr=[], count=0) =>
  Array.isArray(arr) && arr.length <= 1 && Array.isArray(arr[0])
  ? depth(arr[0], count + 1)
  : count + 1

const flattenArray = (arr=[]) =>
  Array.from(arr)
    .reduce((acc, child) =>
      Array.isArray(child)
      ? acc.concat(flattenArray(child))
      : acc.concat(child)
    , [])