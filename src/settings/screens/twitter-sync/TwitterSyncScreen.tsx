import React, { useCallback, useEffect, useState } from 'react';
import { B1, Button, H1, Row, ScreenSection } from '~ui';
import InputContainer from '~/common/components/InputContainer';
import mindsConfigService from '~/common/services/minds-config.service';
import useCurrentUser from '~/common/hooks/useCurrentUser';
import { Linking, ScrollView } from 'react-native';
import ThemedStyles from '~styles/ThemedStyles';
import KeyboardSpacingView from '~/common/components/KeyboardSpacingView';
import { showNotification } from '../../../../AppMessages';
import i18n from '~/common/services/i18n.service';
import Switch from 'react-native-switch-pro';
import MText from '~/common/components/MText';
import CenteredLoading from '~/common/components/CenteredLoading';
import { observer } from 'mobx-react';
import useConnectedAccount from './hooks/useConnectedAccount';
import useConnectAccount from './hooks/useConnectAccount';
import useUpdateAccount from './hooks/useUpdateAccount';
import useDisconnectAccount from './hooks/useDisconnectAccount';
import delay from '~/common/helpers/delay';

function TwitterSyncScreen() {
  const mindsSettings = mindsConfigService.getSettings()!;
  const minFollowers = mindsSettings.twitter?.min_followers_for_sync;

  const user = useCurrentUser();
  const {
    connectedAccount,
    error: connectedAccountError,
  } = useConnectedAccount();
  const {
    connectAccount,
    loading: connectAccountLoading,
  } = useConnectAccount();
  const { updateAccount } = useUpdateAccount();
  const {
    disconnectAccount,
    loading: disconnectAccountLoading,
  } = useDisconnectAccount();

  const [twitterHandle, setTwitterHandle] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [errorsVisible, setErrorsVisible] = useState(false);
  const [isSynced, setIsSynced] = useState<boolean | undefined>(undefined);
  const [discoverable, setDiscoverable] = useState<boolean>(
    connectedAccount?.discoverable || true,
  );

  /**
   * posts the verification text on twitter by open a url
   **/
  const onPostToTwitter = useCallback(() => {
    if (!user) return;

    const siteUrl = mindsSettings.site_url;
    const tweetMessage =
      'Verifying my channel on @minds. ' + siteUrl + user?.username;

    return Linking.openURL(
      `https://twitter.com/intent/tweet?text=${tweetMessage}`,
    );
  }, [mindsSettings.site_url, user?.username]);

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
  const onDiscoverableChange = useCallback(
    (cb: (success: boolean) => void) => {
      updateAccount({ discoverable: !discoverable })
        .then(() => {
          setDiscoverable(!discoverable);
          cb(true);
        })
        .catch(() => {
          showNotification(
            "Sorry, we couldn't update your preference",
            'danger',
          );
          cb(false);
        });
    },
    [discoverable, updateAccount],
  );

  /**
   * connects account
   **/
  const onConnectAccount = useCallback(async () => {
    showNotification(
      'Please wait a moment, tweets can take a while to be visible.',
      'info',
      10000,
    );
    await delay(10000);
    connectAccount(twitterHandle)
      .then(() => {
        showNotification('Your Twitter account is now synced', 'success');
        setIsSynced(true);
      })
      .catch(() =>
        showNotification(
          "Sorry, we couldn't find your verification post",
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
          "Sorry, we couldn't disconnect your account",
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
            <MText style={switchLabelStyle}>
              {i18n.t('settings.dataSaverDescription')}
            </MText>

            <Switch value={discoverable} onAsyncPress={onDiscoverableChange} />
          </Row>
        </ScreenSection>

        <ScreenSection vertical="XXXL2">
          <Button
            onPress={onDisconnectAccount}
            type="warning"
            mode="outline"
            spinner
            loading={disconnectAccountLoading}>
            Disconnect
          </Button>
        </ScreenSection>
      </>
    );
  } else if (isSynced === false) {
    content = (
      <>
        <ScreenSection top="L2">
          <H1>Step 1</H1>
          <B1 color="secondary" vertical="L">
            We need you to create a Tweet so that we can pair your account. It's
            important that the pre-populated link is not changed.
          </B1>
          <Button onPress={onPostToTwitter} type={'action'} mode={'outline'}>
            Create a Tweet
          </Button>
        </ScreenSection>
        <ScreenSection top="L2">
          <H1>Step 2</H1>
          <B1 color="secondary" vertical="L">
            What is your Twitter handle (e.g. @minds)
          </B1>
        </ScreenSection>
        <InputContainer
          placeholder={'e.g. @minds'}
          onChangeText={onUsernameChange}
          autoComplete="username"
          textContentType="username"
          value={twitterHandle}
          onBlur={onBlur}
          onFocus={onFocus}
          error={!isValid && errorsVisible ? 'Invalid handle' : undefined}
        />

        <ScreenSection top="L" bottom="XXXL2">
          <Button
            onPress={onConnectAccount}
            type="action"
            mode="outline"
            loading={connectAccountLoading}
            spinner
            disabled={!validateHandle(twitterHandle)}>
            Verify
          </Button>
        </ScreenSection>
      </>
    );
  } else {
    content = <CenteredLoading />;
  }

  return (
    <KeyboardSpacingView style={ThemedStyles.style.flexContainer} noInset>
      <ScrollView
        style={ThemedStyles.style.flexContainer}
        keyboardDismissMode={'on-drag'}>
        <ScreenSection top="L">
          <B1 color="secondary">
            Using our Twitter Sync tool, Twitter users with over{' '}
            {Number(minFollowers).toLocaleString()} followers can have their new
            tweets automatically copied over from Twitter to Minds. Retweets,
            replies, and tweet deletions are not synced to Minds. You can edit
            and/or delete posts on Minds through the Minds app or website.
          </B1>
        </ScreenSection>

        {content}
      </ScrollView>
    </KeyboardSpacingView>
  );
}

export default observer(TwitterSyncScreen);

const switchLabelStyle = ThemedStyles.combine(
  'flexContainer',
  'marginRight6x',
  'fontL',
);
