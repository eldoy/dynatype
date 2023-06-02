const assert = require('assert')
require('../index.js')

async function main() {
  // Test empty function
  let fn = fun(() => {
    return 'hello'
  })
  let result = fn()
  assert.deepEqual(result, 'hello')

  // Test typed function
  fn = fun('string', 'string', (a, b) => {
    return a + b
  })
  result = fn('a', 'b')
  assert.deepEqual(result, 'ab')

  // Test function with wrong return value
  let message
  try {
    fn = fun(
      'string',
      'string',
      (a, b) => {
        return a + b
      },
      'number'
    )
    result = fn('a', 'b')
  } catch (e) {
    message = e.message
  }
  assert.deepEqual(message, `invalid return type: string`)

  // Test function with correct return value
  fn = fun(
    'string',
    'string',
    (a, b) => {
      return a + b
    },
    'string'
  )
  result = fn('a', 'b')
  assert.deepEqual(result, 'ab')

  // Test empty async function
  fn = fun(async () => {
    return 'hi'
  })
  result = await fn()
  assert.deepEqual(result, 'hi')

  // Test async function with wrong return value
  message = null
  try {
    fn = fun(
      'string',
      'string',
      async (a, b) => {
        return a + b
      },
      'number'
    )
    result = await fn('a', 'b')
  } catch (e) {
    message = e.message
  }
  assert.deepEqual(message, `invalid return type: string`)
}

main()
