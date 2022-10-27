const inflection = require('inflection');
const changeCase = require('change-case');
module.exports = {
  prompt: ({ inquirer, args }) => {
    const { name } = args;
    const questions = [
      !name
        ? {
            type: 'input',
            name: 'name',
            message: 'What is the module name?',
          }
        : null,
      {
        type: 'confirm',
        name: 'components',
        message: 'Include components?',
      },
      // {
      //   type: 'confirm',
      //   name: 'assets',
      //   message: 'Include assets?',
      // },
      {
        type: 'confirm',
        name: 'widget',
        message: 'Include widget?',
      },
      {
        type: 'confirm',
        name: 'api',
        message: 'Include logic?',
      },
      {
        type: 'confirm',
        name: 'store',
        message: 'Include teaful.js store?',
      },
      {
        type: 'confirm',
        name: 'deeplink',
        message: 'Include deepLink?',
      },
    ];

    return inquirer.prompt(questions).then(answers => {
      const name = changeCase.snakeCase(
        (args?.name || answers?.name).toLowerCase(),
      );
      const dashName = inflection.dasherize(name);
      const camelName = inflection.camelize(name, true);
      const CamelName = inflection.camelize(name);
      const singularName = inflection.singularize(camelName);
      const SingularName = inflection.singularize(CamelName);
      const pluralName = inflection.pluralize(camelName);
      const PluralName = inflection.pluralize(CamelName);

      const absPath = `src/modules/${dashName}`;
      return {
        ...answers,
        assets: false,
        absPath,
        dashName,
        camelName,
        CamelName,
        pluralName,
        PluralName,
        singularName,
        SingularName,
      };
    });
  },
};
