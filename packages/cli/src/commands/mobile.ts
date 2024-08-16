import { GluegunCommand } from 'gluegun'
import { cliHeader } from '../tools/pretty'

const command: GluegunCommand = {
  name: 'mobile',
  run: async (toolbox) => {
    cliHeader()
  },
}

module.exports = command
