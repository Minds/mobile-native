import ThemedStyles from '~/styles/ThemedStyles';
import { ColorsNameType } from '~/styles/Colors';

export const getPropStyles = (props: any) => {
  const styles: any = [];
  if (!(props && typeof props === 'object')) {
    return styles;
  }

  const keys = Object.keys(props);

  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    const label = `${key}${props[key]}`;
    try {
      const style = ThemedStyles.style[label];
      if (style) {
        styles.push(style);
      }
    } catch (e) {
      //
    }
  }

  return styles;
};

export const getPropColor = (color: ColorsNameType, active: boolean) => {
  if (active === true) {
    return ThemedStyles.style.colorLink.color;
  }
  if (typeof color !== 'string') {
    return '';
  }
  return color
    ? color.match(/^#/)
      ? color
      : ThemedStyles.getColor(color)
    : null;
};
