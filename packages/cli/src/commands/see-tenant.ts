import { GluegunToolbox } from 'gluegun'
import { p, command, warning, heading, prettyJson } from '../tools/pretty'
import { spinnerAction } from '../tools/spinner'
import { getTenantConfig } from '../tools/tenant-config'

module.exports = {
  dashed: true,
  alias: ['see'],
  description: 'Shows the configuration of the tenant',
  run: async (toolbox: GluegunToolbox) => {
    const { parameters } = toolbox

    // the param is returned as a number
    const tenantID = `${parameters.first}`

    if (!tenantID) {
      warning('Please specify the ID of the network: ')
      p()
      command('mobile setup-tenant', '<network-id>', [
        'mobile setup-tenant 1',
        'mobile setup-tenant 1 --preview',
      ])
      return
    }

    const result = await spinnerAction('Getting tenant config', () => {
      return getTenantConfig(tenantID)
    })

    heading(`Tenant ${tenantID} configuration:`)

    toolbox.print.info(prettyJson(result))
  },
}
