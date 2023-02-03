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
