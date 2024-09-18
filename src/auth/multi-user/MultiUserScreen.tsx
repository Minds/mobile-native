import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react';
import React from 'react';
import { View } from 'react-native';
import { ModalFullScreen } from '~ui';

import FitScrollView from '../../common/components/FitScrollView';
import MenuItem from '../../common/components/menus/MenuItem';
import LoggedUsersList from './logged-users/LoggedUsersList';
import { withErrorBoundaryScreen } from '~/common/components/ErrorBoundaryScreen';
import { AuthType } from '~/common/services/storage/session.storage.service';
import sp from '~/services/serviceProvider';

type PropsType = {};

const MultiUserScreen = ({}: PropsType) => {
  const theme = sp.styles.style;
  const navigation = useNavigation();

  const options = React.useMemo(
    () => ({
      create: {
        title: sp.i18n.t('multiUser.create'),
        onPress: () => navigation.navigate('MultiUserRegister'),
      },
      login: {
        title: sp.i18n.t('multiUser.login'),
        onPress: () => navigation.navigate('MultiUserLogin'),
      },
    }),
    [navigation],
  );

  const isCookieAuth =
    sp.session.getSessionForIndex(sp.session.activeIndex)?.authType ===
    AuthType.Cookie;

  return (
    <ModalFullScreen
      back
      title={sp.i18n.t('multiUser.switchChannel')}
      loading={sp.session.switchingAccount}>
      <FitScrollView>
        <LoggedUsersList />
        {isCookieAuth ? (
          <></>
        ) : (
          <View style={theme.marginTop10x}>
            <MenuItem
              containerItemStyle={theme.bgPrimaryBackgroundHighlight}
              {...options.create}
            />
            <MenuItem
              containerItemStyle={menuStyle}
              testID="multiUserLogin"
              {...options.login}
            />
          </View>
        )}
      </FitScrollView>
    </ModalFullScreen>
  );
};

const menuStyle = sp.styles.combine(
  'bgPrimaryBackgroundHighlight',
  'borderTop0x',
);

export default withErrorBoundaryScreen(
  observer(MultiUserScreen),
  'MultiUserScreen',
);
