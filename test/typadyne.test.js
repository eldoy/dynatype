const assert = require('assert')
const fun = require('../index.js')

async function main() {
  // Test empty function
  let result = fun(() => {
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

  // Test function with wrong return value
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
    err = e.message
  }
  assert.deepEqual(err, `return value is not email`)

  // Test function with correct return value
  result = fun(
    { string: 'a' },
    { string: 'b' },
    (a, b) => {
      return a + b
    },
    'string'
  )
  assert.deepEqual(result, 'ab')

  // Test async function with wrong return value
  err = null
  try {
    result = await fun(
      { string: 'a' },
      { string: 'b' },
      async (a, b) => {
        return a + b
      },
      'email'
    )
  } catch (e) {
    err = e.message
  }
  assert.deepEqual(err, `return value is not email`)

  console.log('All tests passed!')
}

main()
