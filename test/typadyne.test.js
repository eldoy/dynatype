const assert = require('assert')

const fun = require('../index.js')

async function main() {
  // Test empty function
  let result = fun(() => {
    console.log('hello')
    return 'hello'
  })
  assert.deepEqual(result, 'hello')

  // Test empty async function
  result = await fun(async () => {
    return 'hi'
  })
  assert.deepEqual(result, 'hi')

  // Test typed function
  result = fun({ string: 'a' }, { string: 'b' }, (a, b) => {
    return a + b
  })
  assert.deepEqual(result, 'ab')

  // Test empty function with wrong return value
  let err
  try {
    result = fun(
      { string: 'a' },
      { string: 'b' },
      (a, b) => {
        return a + b
      },
      'email'
    )
  } catch (e) {
    console.log(e.message)
    err = e.message
  }
  assert.deepEqual(err, `return value is not email`)
}

main()
