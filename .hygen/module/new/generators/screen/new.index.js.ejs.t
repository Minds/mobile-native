---
to: "<%= `${absPath}/.hygen/screen/new/index.js` %>"
---
const inflection = require('inflection')
const changeCase = require('change-case')
module.exports = {
  prompt: ({ inquirer, args }) => {
    const { name } = args
    const questions = [
      !name ? {
        type: 'input',
        name: 'name',
        message: 'What is the screen name?'
      } : null,
      {
        type: 'confirm',
        name: 'components',
        message: 'Include components?',
      },
      {
        type: 'confirm',
        name: 'assets',
        message: 'Include assets?',
      },
      {
        type: 'confirm',
        name: 'api',
        message: 'Include logic?',
      },
      {
        type: 'confirm',
        name: 'store',
        message: 'Include store?',
      },
      {
        type: 'confirm',
        name: 'deeplink',
        message: 'Include deepLink?',
      },
    ]
    return inquirer
      .prompt(questions)
      .then(answers => {
        const name = changeCase.snakeCase((args.name || answers.name).toLowerCase())
        const dashName = inflection.dasherize(name)
        const camelName = inflection.camelize(name, true)
        const CamelName = inflection.camelize(name)
        const pluralName = inflection.pluralize(camelName)
        const PluralName = inflection.pluralize(CamelName)
        const singularName = inflection.singularize(camelName)
        const SingularName = inflection.singularize(CamelName)
        const absPath = process.cwd()
        const mainName = absPath.split('/').slice(-1)[0]
        const relPath = `screens/${dashName}`
        return { ...answers, relPath, absPath, mainName, dashName, camelName, CamelName, pluralName, PluralName }
      })
  }
}
