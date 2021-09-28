import { ColorsNameType } from '~styles/Colors';
import ThemedStyles from '~styles/ThemedStyles';

export const getIconColor = ({
  color,
  active,
  activeColor,
  disabled,
  disabledColor,
}: {
  color: ColorsNameType;
  active: boolean;
  activeColor: ColorsNameType;
  disabled: boolean;
  disabledColor: ColorsNameType;
}) => {
  if (disabled === true && disabledColor) {
    return ThemedStyles.getColor(disabledColor);
  }
  if (active === true && activeColor) {
    return ThemedStyles.getColor(activeColor);
  }

  return ThemedStyles.getColor(color);
};
