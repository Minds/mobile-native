import { TYPES } from '~ui/typography/constants';
import type { ThemedStylesStore } from '~styles/ThemedStyles';
import { FONT_FAMILY } from '~styles/Tokens';

const regex = /^typo_(.+)_(.+)_(.+)_(.+)_(.+)/g;

const colorMap = {
  primary: 'colorPrimaryText',
  secondary: 'colorSecondaryText',
  tertiary: 'colorTertiaryText',
  link: 'colorLink',
  white: 'colorWhite',
  black: 'colorBlack',
  danger: 'colorDangerBackground',
};

/**
 * Typography style generator
 * To be used by the Typography component
 */
export default function typography(name: string, ts: ThemedStylesStore) {
  if (name.startsWith('typo_')) {
    regex.lastIndex = 0;
    const result = regex.exec(name);

    if (result) {
      const style = [
        ts.style[colorMap[result[3]]], // color
        { fontFamily: FONT_FAMILY[result[2]] }, // font family
        TYPES[result[1]], // typography type
        { textAlign: result[4] }, // alignment
      ];

      // flat?
      if (result[5] === 'true') {
        style.push({ lineHeight: TYPES[result[1]].fontSize + 2 });
      }
      return style;
    }
  }
}
