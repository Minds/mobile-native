import { GluegunCommand } from 'gluegun'
import { direction, heading, link, p, command } from '../tools/pretty'

const commandImp: GluegunCommand = {
  name: 'mobile',
  alias: ['help'],
  run: async (toolbox) => {
    p()

    heading(`Welcome to Minds Mobile CLI ${toolbox.meta.version()}!`)
    p()
    heading('Commands')
    p()
    command(
      'setup-tenant       ',
      'Fetches the tenant configuration and assets for production or a preview',
      ['mobile setup-tenant 10', 'mobile setup-tenant 10 --preview']
    )
    p()
    command('see-tenant         ', 'Shows the tenant configuration', [
      'mobile see-tenant 10',
      'mobile see-tenant https://mynetwork.com',
    ])
    p()
    command('setup-previewer    ', 'Prepares the previewer app for building', [
      'mobile see-tenant 10',
    ])
    p()
    direction(
      `If you find any issue please report it to: ${link(
        'https://gitlab.com/minds/mobile-native/-/issues'
      )}`
    )
    p()
  },
}

module.exports = commandImp
