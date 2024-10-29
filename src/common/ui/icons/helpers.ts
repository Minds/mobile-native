import { ColorsNameType } from '~styles/Colors';
import sp from '~/services/serviceProvider';
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
    return sp.styles.getColor(defaultColor);
  }

  if (color) {
    return sp.styles.getColor(color);
  }

  if (active === true) {
    return sp.styles.getColor(activeColor);
  }

  if (light === true) {
    return sp.styles.getColor(lightColor);
  }

  return sp.styles.getColor(disabledColor);
};
