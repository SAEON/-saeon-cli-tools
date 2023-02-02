# @saeon/cli-tools

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Install](#install)
- [Usage](#usage)
- [Local development](#local-development)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Install
```sh
npm i @saeon/cli-tools
```
 
# Usage

```js
import { buildCli, describe, withFlags } from '@saeon/cli-tools'

/**
 * Specify a function that takes a single object
 * as a parameter. You can assume the keys of
 * this object parameter if you use the 'withFlags'
 * function (see below)
 */
const fn = async ({ argA, argB }) => {
  await new Promise(res => setTimeout(res, 2000))
  return { argA, argB }
}

/**
 * Specify what flags that function should be passed
 *
 * keys with values that are other keys are treated as
 * aliases (aliases can ONLY be single letters)
 */
const fnWithFlags = withFlags(
  fn,
  {
    argA: String,
    argB: Number,
    a: 'argA',
    b: 'argB'
  }
)

/**
 * Describe the function
 *
 * This is used to output helpful
 * CLI documentation
 */
const describedFn = describe(
  fnWithFlags,
  {
    title: 'Some title',
    description: 'Some description'
  }
)

// Build the CLI
const cli = describe({
  fn: describedFn, // <cli> fn -a something -b 42

  // Sub-commands
  subcommand: describe({
    cmd: describe(withFlags(({flag}) => ({ cmd }), { flag: String, f: 'flag' }), { ... }) // <cli> cmd --flag Hello!
  },
  {
    title: 'Some sub-command',
    description: 'Some description'
  })
}, {
  title: 'Some title',
  description: 'Some description'
})
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
