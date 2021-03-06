import { useNavigation } from '@react-navigation/core';
import { observer } from 'mobx-react';
import React from 'react';
import { Text } from 'react-native';
import sessionService from '../../../common/services/session.service';
import ThemedStyles from '../../../styles/ThemedStyles';
import { getFriendlyLabel } from './EarningsOverview';

type PropsType = {
  earningId: string;
};

const AccordionHeaderTitle = observer(({ earningId }: PropsType) => {
  const theme = ThemedStyles.style;
  const user = sessionService.getUser();
  const navigation = useNavigation();

  const onCompletePro = success => {
    if (success) {
      user.togglePro();
    }
  };

  const onCompletePlus = success => {
    if (success) {
      user.togglePlus();
    }
  };

  const navToPro = () =>
    navigation.navigate('UpgradeScreen', {
      onComplete: onCompletePro,
      pro: true,
    });
  const navToPlus = () =>
    navigation.navigate('UpgradeScreen', {
      onComplete: onCompletePlus,
      pro: false,
    });

  const upgradeStyle = [
    theme.fontL,
    theme.fontMedium,
    theme.colorSecondaryText,
  ];

  return (
    <Text style={[theme.fontLM, theme.fontMedium]}>
      {getFriendlyLabel(earningId)}
      {earningId === 'partner' && !user.pro && (
        <Text style={upgradeStyle}>
          {'\n'}
          Upgrade to{' '}
          {!user.plus && (
            <Text style={[upgradeStyle, theme.colorLink]} onPress={navToPlus}>
              plus
            </Text>
          )}
          {!user.plus ? ' or ' : ' '}{' '}
          <Text style={[upgradeStyle, theme.colorLink]} onPress={navToPro}>
            pro
          </Text>
        </Text>
      )}
    </Text>
  );
});

export default AccordionHeaderTitle;
