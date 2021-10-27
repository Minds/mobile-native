import { ColorsNameType } from '~styles/Colors';
import ThemedStyles from '~styles/ThemedStyles';

export const getIconColor = ({
  color,
  active,
  activeColor,
  disabled,
  disabledColor,
  defaultColor,
}: {
  color?: ColorsNameType;
  active: boolean;
  activeColor: ColorsNameType;
  disabled: boolean;
  disabledColor: ColorsNameType;
  defaultColor: ColorsNameType;
}) => {
  if (!color && !disabled && !active) {
    return ThemedStyles.getColor(defaultColor);
  }

  if (color) {
    return ThemedStyles.getColor(color);
  }

  if (active === true) {
    return ThemedStyles.getColor(activeColor);
  }

  return ThemedStyles.getColor(disabledColor);
};
