import React from 'react';
import sp from '~/services/serviceProvider';
export default function useModernTheme() {
  const commonTheme = React.useMemo(
    () => ({
      backgroundColor: sp.styles.getColor('PrimaryBackgroundHighlight'),
      calendarBackground: sp.styles.getColor('PrimaryBackgroundHighlight'),
      dayTextColor: sp.styles.getColor('PrimaryText'),
      textSectionTitleDisabledColor: sp.styles.getColor('TertiaryText'),

      textDisabledColor: sp.styles.getColor('TertiaryText'),
      textSectionTitleColor: sp.styles.getColor('SecondaryText'),
      indicatorColor: sp.styles.getColor('Link'),
      dotColor: sp.styles.getColor('Link'),
      selectedDayBackgroundColor: sp.styles.getColor('Link'),
      selectedDayTextColor: sp.styles.getColor('White'),
      monthTextColor: sp.styles.getColor('PrimaryText'),
      todayTextColor: sp.styles.getColor('Link'),
      arrowColor: sp.styles.getColor('Link'),

      textHeaderColor: sp.styles.getColor('PrimaryText'),
      textDefaultColor: sp.styles.getColor('PrimaryText'),
      selectedTextColor: sp.styles.getColor('White'),
      mainColor: sp.styles.getColor('Link'),
      textSecondaryColor: sp.styles.getColor('SecondaryText'),
      borderColor: 'rgba(122, 146, 165, 0.1)',
    }),
    [],
  );

  return commonTheme;
}
