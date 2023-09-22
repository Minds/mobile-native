import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react';
import React from 'react';
import { View } from 'react-native';
import { ModalFullScreen } from '~ui';

import FitScrollView from '../../common/components/FitScrollView';
import MenuItem from '../../common/components/menus/MenuItem';
import i18n from '../../common/services/i18n.service';
import sessionService from '../../common/services/session.service';
import ThemedStyles from '../../styles/ThemedStyles';
import LoggedUsersList from './logged-users/LoggedUsersList';
import { withErrorBoundaryScreen } from '~/common/components/ErrorBoundaryScreen';

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
    <ModalFullScreen
      back
      title={i18n.t('multiUser.switchChannel')}
      loading={sessionService.switchingAccount}>
      <FitScrollView>
        <LoggedUsersList />
        <View style={theme.marginTop10x}>
          <MenuItem
            containerItemStyle={theme.bgPrimaryBackgroundHighlight}
            {...options.create}
          />
          <MenuItem containerItemStyle={menuStyle} {...options.login} />
        </View>
      </FitScrollView>
    </ModalFullScreen>
  );
};

const menuStyle = ThemedStyles.combine(
  'bgPrimaryBackgroundHighlight',
  'borderTop0x',
);

export default withErrorBoundaryScreen(
  observer(MultiUserScreen),
  'MultiUserScreen',
);
