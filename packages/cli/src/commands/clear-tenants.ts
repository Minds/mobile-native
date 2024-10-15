import { GluegunToolbox } from 'gluegun'
import { heading, warning, p } from '../tools/pretty'
import { spinnerAction } from '../tools/spinner'
import { clearAllMobileAppVersions } from '../tools/tenant-config'

module.exports = {
  name: 'clear-tenants',
  alias: ['clear'],
  description: 'Clear custom versions for all tenant',
  run: async (toolbox: GluegunToolbox) => {
    heading('Custom version reset')

    try {
      await spinnerAction('Clearing custom versions', async () =>
        clearAllMobileAppVersions()
      )

      p()
      p('Custom versions cleared for all tenants')
    } catch (error) {
      warning(error.message)
      process.exit(1)
    }
    process.exit(0)
  },
}
