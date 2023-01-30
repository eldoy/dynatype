# Typadyne

Dynamic typed JS runtime concept for NodeJS and browser apps:

- Check types during runtime
- Extremely flexible types that are programmable
- No transpiling, no weird languages, just normal Javascript
- Supports function parameters and return types

### Install

```
npm i typadyne
```

### Usage

Start NodeJS with typadyne pre-required globally:
```
# If path is set up for global packages
node -r typadyne

# Try this to set path manually
node -r `npm root -g`/typadyne
```

Expose the typadyne `fun`-function manually:
```js
require('typadyne')
```

### Types

Currently, since this is just a concept, the only built in type is `string`. Add your own types in the `./types` directory. Types are just functions that receive the value and returns `true` if the value is the correct type:

Example for number, in `./types/number.type.js`:

```js
// Example type definition
module.exports = function (val) {
  return typeof val == 'number'
}
```

This makes it possible to add any kind of type, even very complex ones using JSON schema or d8a validations.

Here's an example of an `email` type:
```js
module.exports = function (val) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)
}
```

The types can even share code, and switch based on data during runtime. Flexible, isn't it?

### Typed Javascript

After `require('typadyne')` the `fun`-function is available in the gobal scope. It's just a wrapper for a normal function that does type checking for you.

```js
// Useless, but works without parameters or return types
var result = fun(() => { return 'hello' })

// Without return type (if you don't care)
var pow = fun({ number: 6 }, (n) => {
  return n * n
})

// Using variables
var num = -4
var abs = fun({ number: num }, (n) => {
  return Math.abs(n)
})

// Normal function with typed parameters which returns a string
var name = fun(
  { string: 'Vidar' },
  { string: 'Eldøy' },
  (firstname, lastname) => {
    return firstname + ' ' + lastname
  },
  'string'
)

// Use await with async function, returns a custom type 'email'
var emailAddress = await fun(
  { string: 'vidar' },
  { domain: 'eldoy.com' },
  async (name, domain) => {
    return `${name}@${domain}`
  },
  'email'
)
```

ISC licensed. Enjoy!
