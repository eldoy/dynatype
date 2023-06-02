# Typadyne

Dynamic typed JS runtime concept for NodeJS apps:

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

Currently, since this is just a concept, the only built in types are `string` and `number`. Add your own types in the `global.types` object. Types are just functions that receive the value and returns `true` if the value is the correct type:

Example for number:

```js
// Example type definition
global.types.number = function (val) {
  return typeof val == 'number'
}
```

This makes it possible to add any kind of type, even very complex ones using JSON schema or d8a validations.

Here's an example of an `email` type:
```js
global.types.email = function (val) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)
}
```

The types can even share code, and switch based on data during runtime. Flexible, isn't it?

### Typed Javascript

After `require('typadyne')` the `fun`-function is available in the gobal scope. It's just a wrapper for a normal function that sets up type checking for you.

It checks:

- correct number of arguments
- that all types are valid (defined)
- correct type for each function argument
- valid return type

An error is thrown when one of these checks kicks in.

```js
// Useless, but works without parameters or return types
var hello = fun(() => { return 'hello' })
hello() // => 'hello'

// Without return type (if you don't care)
var pow = fun('number', (n) => {
  return n * n
})
pow(2) // => 4

// Normal function with typed parameters which returns a string
var name = fun(
  'string',
  'string',
  (firstname, lastname) => {
    return firstname + ' ' + lastname
  },
  'string'
)
name('Vidar', 'Eldøy') // => 'Vidar Eldøy'

// Use await with async function, returns a custom type 'email'
var getEmailAddress = fun(
  'string',
  'domain',
  async (name, domain) => {
    return `${name}@${domain}`
  },
  'email'
)
await getEmailAddres('vidar', 'eldoy.com') // => 'vidar@eldoy.com
```

WTFPL licensed. Enjoy!