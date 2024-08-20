import { GluegunToolbox } from 'gluegun'
import { p, command, warning, heading, prettyJson, link } from '../tools/pretty'
import { spinnerAction } from '../tools/spinner'
import { getTenantConfig } from '../tools/tenant-config'

module.exports = {
  dashed: true,
  alias: ['see'],
  description: 'Shows the configuration of the tenant',
  run: async (toolbox: GluegunToolbox) => {
    const { parameters } = toolbox

    // the param is returned as a number
    let tenantID = `${parameters.first}`

    if (!tenantID) {
      warning('Please specify the ID of the network or the URL of the site: ')
      p()
      command('mobile setup-tenant', '<network-id>', [
        'mobile setup-tenant 1',
        'mobile setup-tenant 1 --preview',
      ])
      return
    }

    const isURL = toolbox.validUrl(tenantID)

    try {
      if (isURL) {
        const result = await spinnerAction(
          'Getting tenant ID from the site',
          async () => {
            const config = await toolbox.http
              .create({ baseURL: tenantID })
              .get<{ tenant_id: string }>('api/v1/minds/config')
            return config.data.tenant_id
          }
        )
        if (typeof result === 'number' && isFinite(result)) {
          tenantID = `${result}`
        } else {
          warning('Unable to get the tenant ID from the site')
        }
      }

      const result = await spinnerAction('Getting tenant config', () => {
        return getTenantConfig(tenantID)
      })

      heading(`Tenant ${tenantID} configuration:`)

      toolbox.print.info(prettyJson(result))
      p()
      p('Network link:' + link(result.API_URL))
      p()
    } catch (error) {
      warning(error.message)
      return
    }
  },
}
