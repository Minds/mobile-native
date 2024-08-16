import { GluegunToolbox } from 'gluegun'
import { p, command, heading, direction, link } from '../tools/pretty'

module.exports = {
  dashed: true,
  alias: ['h'],
  description: 'Displays Mobile CLI help',
  run: async (toolbox: GluegunToolbox) => {
    const { meta } = toolbox

    p()

    heading(`Welcome to Mobile CLI ${meta.version()}!`)
    p()
    heading('Commands')
    p()
    command(
      'setup-tenant    ',
      'Fetch the tenant configuration and assets for production or a preview',
      ['mobile setup tenant 10', 'mobile setup tenant 10 --preview']
    )
    p()
    direction(
      `See the documentation: ${link(
        'https://github.com/infinitered/ignite/tree/master/docs'
      )}`
    )
    p()
    direction(
      `If you need additional help, join our Slack at ${link(
        'http://community.infinite.red'
      )}`
    )
    p()
  },
}
