# @saeon/cli-tools
Build deeply nested, self-documenting CLI applications dynamically and declaratively.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Install](#install)
- [Usage](#usage)
  - [Simple example](#simple-example)
  - [Complete (nested) example](#complete-nested-example)
    - [Output example](#output-example)
- [Local development](#local-development)
- [Publishing to NPM](#publishing-to-npm)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Install

```sh
npm i @saeon/cli-tools
```

# Usage

## Simple example

```js
import { buildCli, describe, withFlags } from '@saeon/cli-tools'

/**
 * Specify a function that takes a single object
 * as a parameter. You can assume the keys of
 * this object parameter if you use the 'withFlags'
 * function (see below)
 *
 * Functions can be async
 */
const fn = async args => {
  await new Promise(res => setTimeout(res, 1000))
  console.log(args)
}

/**
 * Specify what flags that function should be passed
 *
 * keys with values that are other keys are treated as
 * aliases (aliases can ONLY be single letters)
 */
const fnWithFlags = withFlags(fn, {
  'arg-a': String,
  'arg-b': Number,
  a: 'arg-a',
  b: 'arg-b',
})

/**
 * Describe the function
 *
 * This is used to output helpful
 * CLI documentation
 */
describe(fnWithFlags, {
  title: 'Some title',
  description: 'Some description',
})

// Build a simple CLI
const cli = args =>
  buildCli(
    {
      fn1: () => console.log('fn1 called'),
      fn2: async () => {
        await new Promise(res => setTimeout(res, 1000))
        console.log('fn2 called')
      },
      'fn-with-flags': fnWithFlags,
    },
    args
  )

cli(process.argv.slice(2))
```

## Complete (nested) example

```js
import { buildCli, describe, withFlags } from '@saeon/cli-tools'

const cli = args =>
  buildCli(
    describe(
      {
        'simple-function': () => console.log('Run a simple function with no args'),
        'simple-described-function': describe(
          () => console.log('This function has a helpful description in the help output'),
          {
            title: 'A described function',
            description: 'You can add descriptions to cmds and/or functions using describe()',
          }
        ),
        'simple-function-with-args': withFlags(
          ({ name }) => {
            if (!name) {
              console.log('Specify the  name flag! (--name or -n)')
              return
            }
            console.log('Function calld with name', name)
          },
          {
            name: String,
            n: 'name',
          }
        ),
        'simple-described-function-with-args': describe(
          withFlags(
            async ({ name }) => {
              if (!name) {
                console.log('Specify the  name flag! (--name or -n)')
                return
              }
              console.log('Function calld with name', name)
            },
            {
              name: String,
              n: 'name',
            }
          ),
          {
            title: 'Described, async function with args',
            description: 'A described, async function that accepts args. Defined declaratively!',
          }
        ),
        'sub-cmd': describe(
          {
            'simple-function': async () => {
              await new Promise(res => setTimeout(res, 1000))
              console.log('Simple async function of sub-cmd with no args')
            },
            'sub-sub-cmd': describe(
              {
                'async-fn-with-flags': describe(
                  withFlags(
                    async ({ duration }) => {
                      if (!duration) {
                        console.log('Specify the duration flag (--duration or -d)')
                        return
                      }
                      await new Promise(res => setTimeout(res, duration * 1000))
                      console.log(`Well done for waiting ${duration} seconds`)
                    },
                    { duration: Number, d: 'duration' }
                  ),
                  {
                    title: 'Another function',
                    description: 'This one is quite deeply nested',
                  }
                ),
              },
              {
                title: 'Sub-sub command',
                description: 'Build deeply nested CLIs like this',
              }
            ),
          },
          {
            title: 'Sub command',
            description:
              'Example of nested sub-command. Sub cmds and fns are hidden from top level output',
          }
        ),
      },
      {
        title: 'CLI Example',
        description: 'The CLI, cmds, and functions are all described the same way',
      }
    ),
    args
  )

cli(process.argv.slice(2))
```

### Output example

Running the nested example above, this is the output

```txt
$ sdp
CLI (@saeon/cli-tools v0.2.0): CLI Example
Unknown command ""

Commands
 simple-function                      [Fn []]  No description
 simple-described-function            [Fn []]  You can add descriptions to cmds and/or functions using describe()
 simple-function-with-args            [Fn [name]]  No description
 simple-described-function-with-args  [Fn [name]]  A described, async function that accepts args. Defined declaratively!
 sub-cmd                              [Cmd]  Example of nested sub-command. Sub cmds and fns are hidden from top level output
```

```txt
$ sdp sub-cmd
CLI (@saeon/cli-tools v0.2.0): Sub command
Unknown command ""

Commands
 simple-function  [Fn []]  No description
 sub-sub-cmd      [Cmd]  Build deeply nested CLIs like this
```

```txt
$ sdp sub-cmd sub-sub-cmd
CLI (@saeon/cli-tools v0.2.0): Sub-sub command
Unknown command ""

Commands
 async-fn-with-flags  [Fn [duration]]  This one is quite deeply nested
```

# Local development

From the repository root

```sh
# Install dependencies
npm install

# This registers the 'cli' command on your $PATH
source env.sh

# Run the CLI
sdp
```

# Publishing to NPM

Run `chomp publish:<semver>` (refer to [chompfile.toml](/chompfile.toml) for the command names for `path`, `minor`, and `major` version pushes)
