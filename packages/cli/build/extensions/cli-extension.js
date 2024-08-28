'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
// add your CLI-specific functionality here, which will then be accessible
// to your commands
module.exports = function (toolbox) {
  toolbox.verifyMobileFolder = function () {
    return (
      toolbox.filesystem.exists('tenant.json') === 'file' &&
      toolbox.filesystem.exists('releases.json') === 'file'
    )
  }
  toolbox.validUrl = function (url) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpLWV4dGVuc2lvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9leHRlbnNpb25zL2NsaS1leHRlbnNpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSwwRUFBMEU7QUFDMUUsbUJBQW1CO0FBQ25CLE1BQU0sQ0FBQyxPQUFPLEdBQUcsVUFBQyxPQUF1QjtJQUN2QyxPQUFPLENBQUMsa0JBQWtCLEdBQUc7UUFDM0IsT0FBTyxDQUNMLE9BQU8sQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxLQUFLLE1BQU07WUFDbkQsT0FBTyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLEtBQUssTUFBTSxDQUN0RCxDQUFBO0lBQ0gsQ0FBQyxDQUFBO0lBQ0QsT0FBTyxDQUFDLFFBQVEsR0FBRyxVQUFDLEdBQVc7UUFDN0IsSUFBSTtZQUNGLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFBO1lBQ1osT0FBTyxJQUFJLENBQUE7U0FDWjtRQUFDLE9BQU8sR0FBRyxFQUFFO1lBQ1osT0FBTyxLQUFLLENBQUE7U0FDYjtJQUNILENBQUMsQ0FBQTtJQUVELHdEQUF3RDtJQUN4RCw4REFBOEQ7SUFDOUQsMkJBQTJCO0lBQzNCLHFCQUFxQjtJQUNyQix1QkFBdUI7SUFDdkIsMERBQTBEO0lBQzFELElBQUk7QUFDTixDQUFDLENBQUEifQ==
