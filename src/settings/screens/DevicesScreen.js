import React from 'react';
import { observer } from 'mobx-react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, H4, B3, B1, Column, Item, ScreenSection, Screen } from '~ui';
import ThemedStyles from '../../styles/ThemedStyles';
import i18n from '../../common/services/i18n.service';
import CenteredLoading from '../../common/components/CenteredLoading';
// import Button from '../../common/components/Button';
import useApiFetch from '../../common/hooks/useApiFetch';
import apiService from '../../common/services/api.service';
import MText from '../../common/components/MText';
import { TENANT } from '~/config/Config';

const options = {
  retry: 0,
};

export default observer(function DeviceScreen() {
  const theme = ThemedStyles.style;
  const inset = useSafeAreaInsets();

  const { result, loading, error, fetch } = useApiFetch(
    'api/v3/sessions/common-sessions/all',
    options,
  );
  const revokeSession = React.useCallback(
    session => {
      apiService
        .delete(
          `api/v3/sessions/common-sessions/session?id=${session.id}&platform=${session.platform}`,
        )
        .then(() => fetch());
    },
    [fetch],
  );

  const padding = {
    paddingBottom: inset.bottom + 20,
  };

  return (
    <Screen
      scroll
      style={[
        theme.flexContainer,
        theme.bgPrimaryBackground,
        theme.paddingTop4x,
        padding,
      ]}>
      {error && (
        <MText style={[theme.fontL, theme.centered, theme.colorSecondaryText]}>
          {i18n.t('sorry')} {i18n.t('cantLoad')}
        </MText>
      )}
      {loading ? (
        <CenteredLoading />
      ) : (
        <>
          <ScreenSection top="XL">
            <B1>{i18n.t('settings.sessionsOpened', { TENANT })}</B1>
          </ScreenSection>
          {result?.sessions.map((s, i) => {
            return (
              <Item>
                <Column right="XS">
                  <H4>{s.platform}</H4>
                  <B3 top="XS">{s.ip}</B3>
                  <B3 top="XXS">
                    Last accessed on{' '}
                    <B3 font="medium">
                      {i18n.date(1000 * s.last_active, 'datetime')}
                    </B3>
                  </B3>
                </Column>
                <Button
                  size="tiny"
                  mode="solid"
                  type="warning"
                  align="center"
                  onPress={() => revokeSession(s)}>
                  {i18n.t('revoke')}
                </Button>
              </Item>
            );
          })}
        </>
      )}
    </Screen>
  );
});

const styles = {
  button: {
    position: 'absolute',
    zIndex: 1000,
    right: 20,
    top: 15,
  },
  text: {
    paddingVertical: 3,
  },
};
