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
  color: ColorsNameType | null;
  active: boolean;
  activeColor: ColorsNameType;
  disabled: boolean;
  disabledColor: ColorsNameType;
  defaultColor: ColorsNameType;
}) => {
  if (color && !active) {
    return ThemedStyles.getColor(color);
  }

  if (!color && !disabled && !active) {
    return ThemedStyles.getColor(defaultColor);
  }

  if (active === true) {
    return ThemedStyles.getColor(activeColor);
  }

  return ThemedStyles.getColor(disabledColor);
};
