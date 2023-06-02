global.types = {
  string: (val) => typeof val == 'string',
  number: (val) => typeof val == 'number'
}

global.fun = function (...args) {
  let $ = { types: [] }
  let i = 0
  while (typeof args[i] == 'string') {
    let fn = (global.types || {})[args[i]]
    if (typeof fn != 'function') {
      throw new Error(`unknown type: ${args[i]}`)
    }
    $.types.push(args[i++])
  }
  $.fn = args[i++]
  $.ret = args[i]

  function gate(val) {
    if ($.ret && typeof val != $.ret) {
      throw new Error(`invalid return type: ${typeof val}`)
    }
    return val
  }

  return function (...args) {
    if ($.types.length != args.length) {
      throw new Error('wrong number of arguments')
    }
    for (let j = 0; j < $.types.length; j++) {
      let want = $.types[j]
      let got = typeof args[j]
      if (want != got) {
        throw new Error(`argument ${j + 1}: expected ${want}, got ${got}`)
      }
    }

    let result = $.fn(...args)
    if (typeof result.then == 'function') {
      return new Promise(function (resolve, reject) {
        result.then((val) => resolve(gate(val))).catch(reject)
      })
    }
    return gate(result)
  }
}
