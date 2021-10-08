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
  if (disabled === true && disabledColor) {
    return ThemedStyles.getColor(disabledColor);
  }
  if (!color && active === true && activeColor) {
    return ThemedStyles.getColor(activeColor);
  }
  if (!color) {
    return ThemedStyles.getColor(defaultColor);
  }

  return ThemedStyles.getColor(color);
};
