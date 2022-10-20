const changeCase = require('change-case');

module.exports = {
  prompt: ({ inquirer, args }) => {
    const { name } = args;
    const questions = [
      {
        type: 'confirm',
        name: 'ignoreDeprecated',
        message: 'Ignore deprecated?',
        default: true,
      },
      {
        type: 'confirm',
        name: 'fixtures',
        message: 'Include fixtures?',
      },
    ];

    const json = require(name);
    const types = json.components.schemas;
    const { paths, info } = json;

    const getDeepValue = (val, index = 0) => {
      const { items, type, format, example, oneOf, allOf } = val || {};
      // the recursion is too deep. stop after 10 attempts.
      if (index > 10) {
        if (type === 'array') {
          return '[]';
        }
        if (type === 'string') {
          if (format === 'uuid') {
            return "'4e21e046-3be0-11ec-8d3d-0242ac130003'";
          }
          if (val?.enum) {
            return `'${val.enum?.[0]}'`;
          }
        }
        return `'__${val?.['$ref']?.replace('#/components/schemas/', '')}__'`;
      }
      const ref = (items || oneOf?.[0] || allOf?.[0] || val)?.['$ref']?.replace(
        '#/components/schemas/',
        '',
      );
      if (ref) {
        const { example, properties } = types[ref] || {};
        if (example !== undefined) {
          return expandJSON(example);
        }
        if (properties) {
          const props = `{\n${Object.entries(properties || {})
            .map(([p, val]) => `\t\t${p}: ${getDeepValue(val, index + 1)},`)
            .join('\n')}\n\t}`;
          return type === 'array' ? `[${props}]` : props;
        }
        return getDeepValue(types[ref]);
      }
      if (type === 'array') {
        if (example) {
          return getDeepValue(example);
        }
        if (items) {
          return `[${getDeepValue(items)}]`;
        }
      }
      if (example) {
        if ([type, format].includes('string')) {
          return `'${example}'`;
        }
        return getDeepValue(example);
      }
      if (oneOf?.[0]?.properties) {
        return getDeepValue(oneOf?.[0]?.properties);
      }
      if (type === 'boolean') {
        return !!example;
      }
      if (type === 'string') {
        if (example !== undefined) {
          return `'${example}'`;
        }
        if (val?.enum) {
          return `'${val.enum?.[0]}'`;
        }
        if (format === 'uuid') {
          return "'4e21e046-3be0-11ec-8d3d-0242ac130003'";
        }
        if (format === 'date-time') {
          return "'2021-10-22T18:22:33'";
        }
        if (format === 'date') {
          return "'2021-10-22'";
        }
        return "''";
      }
      if (['integer', 'number'].includes(type)) {
        return '200';
      }
      if (type === 'object') {
        return '{}';
      }
      if (format === 'string') {
        return "''";
      }
      return expandJSON(val);
    };

    return inquirer.prompt(questions).then(answers => {
      return {
        ...answers,
        paths,
        info,
        types,
        formatPath,
        extractParams,
        getPayload,
        extractContentType,
        extractResponse,
        extractStatus,
        getTypeFromName,
        getTypeValue,
        getDeepValue,
        changeCase,
        removeMarkdown,
      };
    });
  },
};

const getTypeFromName = name => {
  let newName = changeCase.pascalCase(
    name?.replace('#/components/schemas/', ''),
  );
  if (newName.match(/^\d/)) {
    newName = 'T' + newName;
  }
  return newName;
};

const getTypeValue = val => {
  if (val.type === 'array') {
    const { items } = val;
    if (items?.['$ref']) {
      return `${getTypeFromName(items['$ref'])}[]`;
    }
    if (items?.enum) {
      return `(${items.enum.map(e => `'${e}'`).join(' | ')})[]`;
    }
    return `${items?.type
      ?.replace(/integer/, 'number')
      .replace(/object/, 'Record<string, unknown>')}[]`;
  }
  if (val?.['$ref']) {
    return getTypeFromName(val['$ref']);
  }
  if (val?.oneOf || val?.allOf) {
    return (val?.oneOf || val?.allOf)
      .map(item =>
        item?.['$ref']
          ? getTypeFromName(item['$ref'])
          : `<?${JSON.stringify(item, null, 2)}>`,
      )
      .join(' | ');
  }
  if (['integer', 'number'].includes(val?.type)) {
    return 'number';
  }
  if (val?.type === 'object') {
    return 'Record<string, unknown>';
  }
  if (val?.type === 'boolean') {
    return 'boolean';
  }
  if (val?.type === 'string') {
    return val?.enum ? val.enum.map(e => `'${e}'`).join(' | ') : 'string';
  }
  if (!val?.type) {
    if (['uuid', 'string'].includes(val?.format)) {
      return 'string';
    }
  }
  if (val?.example) {
    return typeof val?.example;
  }
  return `unknown type ${JSON.stringify(val)}`;
};

const formatPath = path => {
  if (path.includes('{')) {
    return `\`${path.replace(/\{/g, '${')}\``;
  }
  return `'${path}'`;
};

const extractParams = params =>
  params
    ?.filter(p => ['path', 'query'].includes(p.in))
    .map(
      p =>
        `${p.name}${p.required ? '' : '?'}: ${p.schema?.type?.replace(
          'integer',
          'number',
        )}`,
    ) || [];

const extractContentType = body =>
  body
    ? getTypeFromName(
        (body?.['application/json'] || body[Object.keys(body)?.[0]])?.schema?.[
          '$ref'
        ],
      )
    : undefined;

const getPayload = bodyType => (bodyType ? `payload: ${bodyType}` : undefined);

const extractResponse = response =>
  extractContentType(
    response ? response[extractStatus(response)]?.content : undefined,
  );

const extractStatus = response =>
  response
    ? Object.keys(response).filter(key => key.match(/^2|3\d{2}/))?.[0]
    : undefined;

const removeMarkdown = md => {
  let output = md || '';
  output = output.replace(/^(-\s*?|\*\s*?|_\s*?){3,}\s*$/gm, '');
  try {
    output = output
      .replace(/^([\s\t]*)([\*\-\+]|\d+\.)\s+/gm, '$1')
      // Header
      .replace(/\n={2,}/g, '\n')
      // Fenced codeblocks
      .replace(/~{3}.*\n/g, '')
      // Strikethrough
      .replace(/~~/g, '')
      // Fenced codeblocks
      .replace(/`{3}.*\n/g, '')
      // Remove HTML tags
      .replace(/<[^>]*>/g, '')
      // Remove setext-style headers
      .replace(/^[=\-]{2,}\s*$/g, '')
      // Remove footnotes?
      .replace(/\[\^.+?\](\: .*?$)?/g, '')
      .replace(/\s{0,2}\[.*?\]: .*?$/g, '')
      // Remove images
      .replace(/\!\[(.*?)\][\[\(].*?[\]\)]/g, '$1')
      // Remove inline links
      .replace(/\[(.*?)\][\[\(].*?[\]\)]/g, '$1')
      // Remove blockquotes
      .replace(/^\s{0,3}>\s?/g, '')
      // Remove reference-style links?
      .replace(/^\s{1,2}\[(.*?)\]: (\S+)( ".*?")?\s*$/g, '')
      // Remove atx-style headers
      .replace(
        /^(\n)?\s{0,}#{1,6}\s+| {0,}(\n)?\s{0,}#{0,} {0,}(\n)?\s{0,}$/gm,
        '$1$2$3',
      )
      // Remove emphasis (repeat the line to remove double emphasis)
      .replace(/([\*_]{1,3})(\S.*?\S{0,1})\1/g, '$2')
      .replace(/([\*_]{1,3})(\S.*?\S{0,1})\1/g, '$2')
      // Remove code blocks
      .replace(/(`{3,})(.*?)\1/gm, '$2')
      // Remove inline code
      .replace(/`(.+?)`/g, '$1')
      // Replace two or more newlines with exactly two
      .replace(/\n{2,}/g, '\n\n')
      .replace(/\n/g, '\n * ')
      .replace(/\n \* \n/g, '\n *\n')
      .replace(/  /g, ' ');
  } catch (error) {
    console.error(e);
    return md;
  }
  return output;
};

const cleanJSON = obj =>
  JSON.stringify(obj, null, 2)
    .replace(/"/g, "'")
    .replace(/^[\t ]*'[^:\n\r]+(?<!\\)':/gm, match => match.replace(/'/g, ''));

const expandJSON = val => {
  try {
    return cleanJSON(
      JSON.parse(
        typeof val === 'string'
          ? val
          : JSON.stringify(val, null, 2).replace(
              /#\/components\/schemas\//g,
              '',
            ),
      ),
    );
  } catch (error) {
    return `'${val}'`;
  }
};
