import { GluegunToolbox } from 'gluegun'
import { p, heading, warning } from '../tools/pretty'
import { spinnerAction } from '../tools/spinner'

module.exports = {
  dashed: true,
  description: 'Setup the previewer app',
  run: async (toolbox: GluegunToolbox) => {
    if (!toolbox.verifyMobileFolder()) {
      warning('Run this command in the mobile app folder')
      return
    }

    heading('Preparing the previewer app')
    await spinnerAction('Adding main to package.json', async () => {
      await toolbox.patching.update('package.json', (config) => {
        config.main = 'preview/index.js'
        return config
      })
    })

    await spinnerAction('Moving previewer tenant files', async () => {
      await toolbox.filesystem.copy('./preview/tenant', './', {
        overwrite: true,
      })
    })

    p('Previewer app setup completed!')
  },
}
