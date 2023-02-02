import { buildCli, describe, withFlags } from '@saeon/cli-tools'

const test = withFlags(() => console.log('hi'), {})

const cli = args =>
  buildCli(
    describe(
      {
        test,
      },
      {
        title: 'CLI Tools example',
        description: 'Build highly dynamic CLI applications',
      }
    ),
    args
  )

cli(process.argv.slice(2))
