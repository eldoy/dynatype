const fs = require('fs')
const path = require('path')

// Built in type definitions
const TYPEDEFS = require('./lib/types/index.js')

// User defined type definitions in 'types' dir
const ROOT = process.cwd()
const typedir = path.join(ROOT, 'types')
if (fs.existsSync(typedir)) {
  fs.readdirSync(typedir)
    .map(function (file) {
      return path.join(typedir, file)
    })
    .forEach(function (file) {
      const type = require(file)
      const name = path.basename(file).split('.')[0]
      const def = type.name || name
      TYPEDEFS[def] = type
    })
}

// Usage:
// fun({ string: 'Vidar' }, { string: 'Eldøy' }, (firstname, lastname) => {
//   return firstname + lastname
// })

function fun(...args) {
  let schemas = [],
    fn,
    ret
  for (let i = 0; i < args.length; i++) {
    let v = args[i]
    if (typeof v == 'object') {
      schemas.push(v)
    } else if (typeof v == 'function') {
      fn = v
      ret = args[i + 1]
      break
    }
  }

  if (!fn) {
    throw new Error(`callback function missing`)
  }

  for (const schema of schemas) {
    for (const key in schema) {
      const value = schema[key]
      const type = TYPEDEFS[key]
      if (typeof type != 'function') {
        throw new Error(`argument type ${key} does not exist`)
      }
      const ok = type(value)
      if (!ok) {
        throw new Error(`value is not of type '${key}'`)
      }
    }
  }

  if (ret) {
    const type = TYPEDEFS[ret]
    if (typeof type != 'function') {
      throw new Error(`return type ${ret} does not exist`)
    }
  }

  const params = schemas.map(function (schema) {
    return Object.values(schema)[0]
  })

  const checkret = (val) => {
    if (!ret) return
    const type = TYPEDEFS[ret]
    if (!type(val)) {
      throw new Error(`return value is not ${ret}`)
    }
  }

  const result = fn(...params)
  if (typeof result.then == 'function') {
    return new Promise(function (resolve, reject) {
      result.then((val) => checkret(val) && resolve(val)).catch(reject)
    })
  } else {
    checkret(result)
  }
  return result
}

global.fun = fun
module.exports = fun
