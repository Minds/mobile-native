---
to: "<%= `${absPath}/.hygen/widget/new/index.js` %>"
---
const inflection = require('inflection');
const changeCase = require('change-case');
module.exports = {
  prompt: ({ inquirer, args }) => {
    const { name } = args;
    const questions = [
      !name ? {
        type: 'input',
        name: 'name',
        message: 'What is the widget name?'
      } : null,
      {
        type: 'confirm',
        name: 'api',
        message: 'Include logic?',
      },
    ];
    return inquirer
      .prompt(questions)
      .then(answers => {
        const name = changeCase.snakeCase((args.name || answers.name).toLowerCase());
        const dashName = inflection.dasherize(name);
        const camelName = inflection.camelize(name, true);
        const CamelName = inflection.camelize(name);
        const pluralName = inflection.pluralize(camelName);
        const PluralName = inflection.pluralize(CamelName);
        const singularName = inflection.singularize(camelName);
        const SingularName = inflection.singularize(CamelName);
        const relPath = `widgets/${dashName}`;
        return { ...answers, relPath, dashName, camelName, CamelName, pluralName, PluralName };
      });
  }
}
