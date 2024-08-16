import { GluegunToolbox } from 'gluegun'

// add your CLI-specific functionality here, which will then be accessible
// to your commands
module.exports = (toolbox: GluegunToolbox) => {
  toolbox.verifyMobileFolder = () => {
    return (
      toolbox.filesystem.exists('tenant.json') === 'file' &&
      toolbox.filesystem.exists('releases.json') === 'file'
    )
  }
  toolbox.validUrl = (url: string) => {
    try {
      new URL(url)
      return true
    } catch (err) {
      return false
    }
  }

  // enable this if you want to read configuration in from
  // the current folder's package.json (in a "mobile" property),
  // mobile.config.json, etc.
  // toolbox.config = {
  //   ...toolbox.config,
  //   ...toolbox.config.loadConfig("mobile", process.cwd())
  // }
}
