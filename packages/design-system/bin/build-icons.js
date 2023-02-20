/*eslint handle-callback-err: "error"*/
const fs = require('fs');
const glob = require('glob');
const camelcase = require('camelcase');
const uppercamelcase = require('uppercamelcase');
const path = require('path');
const cheerio = require('cheerio');

const mindsIconsDir = path.join('.', '..', 'minds-icons');
const rootDir = path.join(__dirname, '..');

glob(`${mindsIconsDir}/**.svg`, (err, icons) => {
  if (err) {
    console.log('ERROR:', err.stack);
  }

  fs.writeFileSync(path.join(rootDir, 'src', 'icons.ts'), '', 'utf-8');

  icons.forEach(i => {
    const svg = fs.readFileSync(i, 'utf-8');
    const id = path.basename(i, '.svg');
    const $ = cheerio.load(svg, {
      xmlMode: true,
    });
    const fileName = path.basename(i).replace('.svg', '.tsx');
    const location = path.join(rootDir, 'src/icons', fileName);

    // Because CSS does not exist on Native platforms
    // We need to duplicate the styles applied to the
    // SVG to its children
    const svgAttribs = $('svg')[0].attribs;
    delete svgAttribs.xmlns;
    const attribsOfInterest = {};
    Object.keys(svgAttribs).forEach(key => {
      if (key !== 'height' && key !== 'width' && key !== 'viewBox') {
        attribsOfInterest[key] = svgAttribs[key];
      }
    });

    $('*').each((index, el) => {
      Object.keys(el.attribs).forEach(x => {
        if (x.includes('-')) {
          $(el).attr(camelcase(x), el.attribs[x]).removeAttr(x);
        }
        if (x === 'stroke') {
          $(el).attr(x, 'currentColor');
        }
      });

      // For every element that is NOT svg ...
      if (el.name !== 'svg') {
        Object.keys(attribsOfInterest).forEach(key => {
          $(el).attr(camelcase(key), attribsOfInterest[key]);
        });
      }

      if (el.name === 'svg') {
        $(el).attr('otherProps', '...');
      }
    });

    const cname = uppercamelcase(id);

    const element = `
/* eslint-disable react/react-in-jsx-scope */
import { memo } from 'react';
import { IconProps } from '../IconProps';
import { Svg, Path } from 'react-native-svg';
import { themed } from '../themed';

const Icon = (props: IconProps) => {
  const { color = 'black', size = 32, ...otherProps } = props;
  return (
    ${$('svg')
      .toString()
      .replace(/ class=\"[^\"]+\"/g, '')
      .replace(new RegExp('stroke="currentColor"', 'g'), 'stroke={`${color}`}')
      .replace(new RegExp('stroke="none"', 'g'), 'stroke={`${color}`}')
      .replace(new RegExp('fill="currentColor"', 'g'), 'fill={`${color}`}')
      .replace(new RegExp('fill="none"', 'g'), 'fill={`${color}`}')
      .replace('width="32"', 'width={size}')
      .replace('height="32"', 'height={size}')
      .replace('otherProps="..."', '{...otherProps}')
      .replace('<svg', '<Svg')
      .replace('</svg', '</Svg')
      .replace(new RegExp('<path', 'g'), '<Path')
      .replace(new RegExp('</path', 'g'), '</Path')
      /**
       * add here if necessary:
       *    g, linear-gradient, radial-gradient, line, polygon,
       *    polyline, rect, symbol, text, use, defs, stop
       * and also add the imports from react-native-svg.
       */
      .replace(new RegExp('px', 'g'), '')}
  );
};

Icon.displayName = '${cname}';

export const ${cname} = memo<IconProps>(themed(Icon));
`;

    fs.writeFileSync(location, element, 'utf-8');

    const exportString = `export { ${cname} } from './icons/${id}';\n`;

    console.log(`...${id} icon successfully generated`);

    fs.appendFileSync(
      path.join(rootDir, 'src', 'icons.ts'),
      exportString,
      'utf-8',
    );
  });
});
