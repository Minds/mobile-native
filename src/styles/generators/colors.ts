import { ColorsNameType, DARK_THEME, LIGHT_THEME } from '../Colors';
import type { ThemedStyles } from '../ThemedStyles';

const LIGHT_SUFFIX = '_Light';
const DARK_SUFFIX = '_Dark';

const getLightThemeColor = (prop: ColorsNameType) => {
  return LIGHT_THEME[prop];
};

const getDarkThemeColor = (prop: ColorsNameType) => {
  return DARK_THEME[prop];
};

export default function colors(name: string, ts: ThemedStyles) {
  let fn = ts.getColor.bind(ts),
    tName = name;

  if (tName.endsWith(LIGHT_SUFFIX)) {
    fn = getLightThemeColor;
    tName = tName.slice(0, -6);
  } else if (tName.endsWith(DARK_SUFFIX)) {
    fn = getDarkThemeColor;
    tName = tName.slice(0, -5);
  }

  if (tName.startsWith('bg')) {
    return {
      backgroundColor: fn(tName.substr(2) as ColorsNameType),
    };
  }
  if (tName.startsWith('color')) {
    return {
      color: fn(tName.substr(5) as ColorsNameType),
    };
  }
  if (tName.startsWith('bcolor')) {
    return {
      borderColor: fn(tName.substr(6) as ColorsNameType),
    };
  }
  if (tName.startsWith('shadow')) {
    return {
      shadowColor: fn(tName.substr(6) as ColorsNameType),
    };
  }
}
