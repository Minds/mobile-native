import React from 'react';
import ThemedStyles from '~/styles/ThemedStyles';

export default function useModernTheme() {
  const commonTheme = React.useMemo(
    () => ({
      backgroundColor: ThemedStyles.getColor('PrimaryBackgroundHighlight'),
      calendarBackground: ThemedStyles.getColor('PrimaryBackgroundHighlight'),
      dayTextColor: ThemedStyles.getColor('PrimaryText'),
      textSectionTitleDisabledColor: ThemedStyles.getColor('TertiaryText'),

      textDisabledColor: ThemedStyles.getColor('TertiaryText'),
      textSectionTitleColor: ThemedStyles.getColor('SecondaryText'),
      indicatorColor: ThemedStyles.getColor('Link'),
      dotColor: ThemedStyles.getColor('Link'),
      selectedDayBackgroundColor: ThemedStyles.getColor('Link'),
      selectedDayTextColor: ThemedStyles.getColor('White'),
      monthTextColor: ThemedStyles.getColor('PrimaryText'),
      todayTextColor: ThemedStyles.getColor('Link'),
      arrowColor: ThemedStyles.getColor('Link'),

      textHeaderColor: ThemedStyles.getColor('PrimaryText'),
      textDefaultColor: ThemedStyles.getColor('PrimaryText'),
      selectedTextColor: ThemedStyles.getColor('White'),
      mainColor: ThemedStyles.getColor('Link'),
      textSecondaryColor: ThemedStyles.getColor('SecondaryText'),
      borderColor: 'rgba(122, 146, 165, 0.1)',
    }),
    [],
  );

  return commonTheme;
}
