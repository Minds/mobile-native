import React from 'react';
import { observer } from 'mobx-react';

import { Button, H4, B3, B1, Column, Item, ScreenSection, Screen } from '~ui';

import CenteredLoading from '~/common/components/CenteredLoading';
// import Button from '~/common/components/Button';
import useApiFetch from '~/common/hooks/useApiFetch';
import MText from '~/common/components/MText';
import { TENANT } from '~/config/Config';
import sp from '~/services/serviceProvider';

const options = {
  retry: 0,
};

export default observer(function DeviceScreen() {
  const theme = sp.styles.style;

  const { result, loading, error, fetch } = useApiFetch<{
    sessions: Array<any>;
  }>('api/v3/sessions/common-sessions/all', options);
  const revokeSession = React.useCallback(
    session => {
      sp.api
        .delete(
          `api/v3/sessions/common-sessions/session?id=${session.id}&platform=${session.platform}`,
        )
        .then(() => fetch());
    },
    [fetch],
  );
  const i18n = sp.i18n;

  return (
    <Screen scroll safe>
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
              <Item key={i}>
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
