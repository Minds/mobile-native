import { GluegunToolbox } from 'gluegun'
import { command, em, heading, p, warning } from '../tools/pretty'
import { spinnerAction } from '../tools/spinner'
import {
  getTenantConfig,
  setMobileProductionAppVersion,
} from '../tools/tenant-config'

module.exports = {
  name: 'bump-tenant',
  alias: ['bump'],
  description: 'Bump the tenant to the next patch version',
  run: async (toolbox: GluegunToolbox) => {
    const { parameters } = toolbox

    if (!toolbox.verifyMobileFolder()) {
      warning('Run this command in the mobile app folder')
      return
    }

    // the param is returned as a number
    const tenantID = `${parameters.first}`

    if (!tenantID) {
      warning('Please specify the ID of the network: ')
      p()
      command('mobile bump-tenant', '<network-id>', ['mobile bump-tenant 1'])
      return
    }

    heading('Setting bumping network ' + tenantID)

    try {
      await bumpTenant(tenantID, toolbox)
    } catch (error) {
      warning(error.message)
      process.exit(1)
    }
    process.exit(0)
  },
}

async function bumpTenant(tenantID: string, toolbox: GluegunToolbox) {
  const constants = require('../../../../app.constants')
  try {
    const tenantConfig = await spinnerAction(
      'Getting tenant config',
      async () => getTenantConfig(tenantID)
    )

    const currentVersion =
      tenantConfig.PRODUCTION_APP_VERSION || constants.APP_VERSION

    p('   Current app version: ' + constants.APP_VERSION)
    p('   Current TENANT version: ' + tenantConfig.PRODUCTION_APP_VERSION)

    const [major, minor, patch] = currentVersion.split('.').map(Number)
    const newVersion = `${major}.${minor}.${patch + 1}`

    p('   New version: ' + em(newVersion))

    await spinnerAction('Setting new tenant version', async () =>
      toolbox.patching.replace(
        'app.constants.js',
        `APP_VERSION: '${constants.APP_VERSION}'`,
        `APP_VERSION: '${newVersion}'`
      )
    )

    await spinnerAction('Saving tenant version', async () =>
      setMobileProductionAppVersion(tenantID, newVersion)
    )

    p()
    p('Tenant version bumped to ' + newVersion)
  } catch (error) {
    console.log(error)
  }
}
