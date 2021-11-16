import { ColorsNameType } from '~styles/Colors';
import ThemedStyles from '~styles/ThemedStyles';

export const getIconColor = ({
  color,
  active,
  activeColor,
  disabled,
  disabledColor,
  light,
  lightColor,
  defaultColor,
}: {
  color?: ColorsNameType;
  active: boolean;
  activeColor: ColorsNameType;
  disabled: boolean;
  disabledColor: ColorsNameType;
  light: boolean;
  lightColor: ColorsNameType;
  defaultColor: ColorsNameType;
}) => {
  if (!color && !disabled && !active && !light) {
    return ThemedStyles.getColor(defaultColor);
  }

  if (color) {
    return ThemedStyles.getColor(color);
  }

  if (active === true) {
    return ThemedStyles.getColor(activeColor);
  }

  if (light === true) {
    return ThemedStyles.getColor(lightColor);
  }

  return ThemedStyles.getColor(disabledColor);
};
