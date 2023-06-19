import { observer } from 'mobx-react';
import React, { useCallback, useEffect, useState } from 'react';
import { Linking } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CenteredLoading from '~/common/components/CenteredLoading';
import Switch from '~/common/components/controls/Switch';
import InputContainer from '~/common/components/InputContainer';
import delay from '~/common/helpers/delay';
import useCurrentUser from '~/common/hooks/useCurrentUser';
import i18n from '~/common/services/i18n.service';
import mindsConfigService from '~/common/services/minds-config.service';
import ThemedStyles from '~styles/ThemedStyles';
import { B1, Button, H1, Row, ScreenSection } from '~ui';
import { showNotification } from '../../../../AppMessages';
import useConnectAccount from './hooks/useConnectAccount';
import useConnectedAccount from './hooks/useConnectedAccount';
import useDisconnectAccount from './hooks/useDisconnectAccount';
import useUpdateAccount from './hooks/useUpdateAccount';
import { useTwitterSyncTweetMessageQuery } from '~/graphql/strapi';

function TwitterSyncScreen() {
  const mindsSettings = mindsConfigService.getSettings()!;
  const minFollowers = mindsSettings.twitter?.min_followers_for_sync;

  const user = useCurrentUser();
  const { connectedAccount, error: connectedAccountError } =
    useConnectedAccount();
  const { connectAccount, loading: connectAccountLoading } =
    useConnectAccount();
  const { updateAccount } = useUpdateAccount();
  const { disconnectAccount, loading: disconnectAccountLoading } =
    useDisconnectAccount();

  const [twitterHandle, setTwitterHandle] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [errorsVisible, setErrorsVisible] = useState(false);
  const [isSynced, setIsSynced] = useState<boolean | undefined>(undefined);
  const [discoverable, setDiscoverable] = useState<boolean>(
    connectedAccount?.discoverable || true,
  );

  const { data: { twitterSyncTweetText } = {} } =
    useTwitterSyncTweetMessageQuery();

  const tweetText =
    twitterSyncTweetText?.data?.attributes?.tweetText ??
    'Verifying my channel on @minds. {url}';

  const tweetMessage = tweetText.replace(
    /{url}/g,
    mindsSettings.site_url + user?.username,
  );

  /**
   * posts the verification text on twitter by open a url
   **/
  const onPostToTwitter = useCallback(() => {
    if (!user) {
      return;
    }

    return Linking.openURL(
      `https://twitter.com/intent/tweet?text=${tweetMessage}`,
    );
  }, [tweetMessage, user]);

  /**
   * validates the twitter handle
   **/
  const validateHandle = useCallback(handle => {
    return /^@[A-Za-z0-9_]{1,15}$/.test(handle);
  }, []);

  /**
   * triggers on input blur
   **/
  const onBlur = useCallback(() => {
    setErrorsVisible(true);
    setIsValid(validateHandle(twitterHandle));
  }, [twitterHandle, validateHandle]);

  /**
   * triggers on input blur
   **/
  const onFocus = useCallback(() => {
    setErrorsVisible(false);
  }, []);

  /**
   * triggers on input blur
   **/
  const onUsernameChange = useCallback((value: string) => {
    setErrorsVisible(false);
    setTwitterHandle(value);
  }, []);

  /**
   * triggers on input blur
   **/
  const onDiscoverableChange = useCallback(() => {
    updateAccount({ discoverable: !discoverable })
      .then(() => {
        setDiscoverable(!discoverable);
      })
      .catch(() => {
        showNotification(
          i18n.t('settings.twitterSync.notifs.error.update'),
          'danger',
        );
      });
  }, [discoverable, updateAccount]);

  /**
   * connects account
   **/
  const onConnectAccount = useCallback(async () => {
    showNotification(
      i18n.t('settings.twitterSync.notifs.info.connect'),
      'info',
      10000,
    );
    await delay(10000);
    connectAccount(twitterHandle)
      .then(() => {
        showNotification(
          i18n.t('settings.twitterSync.notifs.success.connect'),
          'success',
        );
        setIsSynced(true);
      })
      .catch(() =>
        showNotification(
          i18n.t('settings.twitterSync.notifs.error.connect'),
          'danger',
        ),
      );
  }, [twitterHandle, connectAccount]);

  /**
   * disconnects account and changes sync status
   **/
  const onDisconnectAccount = useCallback(() => {
    disconnectAccount()
      .then(() => setIsSynced(false))
      .catch(() =>
        showNotification(
          i18n.t('settings.twitterSync.notifs.error.disconnect'),
          'danger',
        ),
      );
  }, [disconnectAccount]);

  useEffect(() => {
    if (connectedAccount) {
      setDiscoverable(connectedAccount.discoverable);
    }

    if (typeof connectedAccount !== 'undefined') {
      setIsSynced(Boolean(connectedAccount));
    }

    if (connectedAccountError) {
      setIsSynced(false);
    }
  }, [connectedAccount, connectedAccountError]);

  let content;
  if (isSynced) {
    content = (
      <>
        <ScreenSection top="L2">
          <Row>
            <B1 containerStyle={ThemedStyles.style.flexContainer} right="XXL">
              {i18n.t('settings.twitterSync.discoverable')}
            </B1>

            <Switch value={discoverable} onChange={onDiscoverableChange} />
          </Row>
        </ScreenSection>

        <ScreenSection vertical="XXXL2">
          <Button
            onPress={onDisconnectAccount}
            type="warning"
            mode="outline"
            spinner
            loading={disconnectAccountLoading}>
            {i18n.t('settings.twitterSync.disconnect')}
          </Button>
        </ScreenSection>
      </>
    );
  } else if (isSynced === false) {
    content = (
      <>
        <ScreenSection top="L2">
          <H1>{i18n.t('settings.twitterSync.step1.title')}</H1>
          <B1 color="secondary" vertical="L">
            {i18n.t('settings.twitterSync.step1.desc')}
          </B1>
          <Button onPress={onPostToTwitter} type={'action'} mode={'outline'}>
            {i18n.t('settings.twitterSync.step1.action')}
          </Button>
        </ScreenSection>
        <ScreenSection top="L2">
          <H1>{i18n.t('settings.twitterSync.step2.title')}</H1>
          <B1 color="secondary" vertical="L">
            {i18n.t('settings.twitterSync.step2.desc')}
          </B1>
        </ScreenSection>
        <InputContainer
          placeholder={i18n.t('settings.twitterSync.step2.input.placeholder')}
          onChangeText={onUsernameChange}
          autoComplete="username"
          textContentType="username"
          value={twitterHandle}
          onBlur={onBlur}
          onFocus={onFocus}
          error={
            !isValid && twitterHandle && errorsVisible
              ? i18n.t('settings.twitterSync.step2.input.error')
              : undefined
          }
        />

        <ScreenSection top="L" bottom="XXXL2">
          <Button
            onPress={onConnectAccount}
            type="action"
            mode="outline"
            loading={connectAccountLoading}
            spinner
            disabled={!validateHandle(twitterHandle)}>
            {i18n.t('settings.twitterSync.step2.action')}
          </Button>
        </ScreenSection>
      </>
    );
  } else {
    content = <CenteredLoading />;
  }

  return (
    <KeyboardAwareScrollView
      style={ThemedStyles.style.flexContainer}
      keyboardDismissMode={'on-drag'}>
      <ScreenSection top="L">
        <B1 color="secondary">
          {i18n.t('settings.twitterSync.description', {
            limit: Number(minFollowers).toLocaleString(),
          })}
        </B1>
      </ScreenSection>

      {content}
    </KeyboardAwareScrollView>
  );
}

export default observer(TwitterSyncScreen);
