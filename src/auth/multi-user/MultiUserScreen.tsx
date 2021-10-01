import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View } from 'react-native';

import FitScrollView from '../../common/components/FitScrollView';
import MenuItem from '../../common/components/menus/MenuItem';
import ModalFullScreen from '../../common/screens/ModalFullScreen';
import i18n from '../../common/services/i18n.service';
import ThemedStyles from '../../styles/ThemedStyles';
import LoggedUsersList from './logged-users/LoggedUsersList';

type PropsType = {};

const MultiUserScreen = ({}: PropsType) => {
  const theme = ThemedStyles.style;
  const navigation = useNavigation();

  const options = React.useMemo(
    () => ({
      create: {
        title: i18n.t('multiUser.create'),
        onPress: () => navigation.navigate('MultiUserRegister'),
      },
      login: {
        title: i18n.t('multiUser.login'),
        onPress: () => navigation.navigate('MultiUserLogin'),
      },
    }),
    [navigation],
  );

  return (
    <ModalFullScreen title={i18n.t('multiUser.switchChannel')}>
      <FitScrollView>
        <LoggedUsersList />
        <View style={theme.marginTop10x}>
          <MenuItem
            item={options.create}
            containerItemStyle={theme.bgPrimaryBackgroundHighlight}
          />
          <MenuItem
            item={options.login}
            containerItemStyle={menuStyle}
            testID="multiUserLogin"
          />
        </View>
      </FitScrollView>
    </ModalFullScreen>
  );
};

const menuStyle = ThemedStyles.combine(
  'bgPrimaryBackgroundHighlight',
  'borderTop0x',
);

export default MultiUserScreen;
