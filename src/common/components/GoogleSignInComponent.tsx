import React, { useEffect, useCallback } from 'react';
import CenteredLoading from '../../common/components/CenteredLoading';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-community/google-signin';
import { useLocalStore, observer } from 'mobx-react';
import { View, Text } from 'react-native-animatable';
import ThemedStyles from '../../styles/ThemedStyles';
import i18n from '../services/i18n.service';
import Button from './Button';

const createGoogleSignInStore = () => {
  const store = {
    loading: true,
    initialLoad: false,
    signedIn: false,
    setLoading(loading) {
      this.loading = loading;
    },
    setInitialLoad(signedIn: boolean) {
      this.initialLoad = true;
      this.signedIn = signedIn;
    },
    setSignedIn(signedIn) {
      this.signedIn = signedIn;
    },
  };
  return store;
};

type propsType = {
  onUserInfoGet: Function;
};

const GoogleSignInComponent = observer(({ onUserInfoGet }) => {
  const theme = ThemedStyles.style;
  const store = useLocalStore(createGoogleSignInStore);

  useEffect(() => {
    if (!store.initialLoad) {
      GoogleSignin.configure();
      const isSignedIn = async () => {
        store.setInitialLoad(await GoogleSignin.isSignedIn());
        if (store.signedIn) {
          onUserInfoGet(await GoogleSignin.signInSilently());
        }
        store.setLoading(false);
      };
      isSignedIn();
    }
  }, [store, onUserInfoGet]);

  const signIn = useCallback(async () => {
    try {
      await GoogleSignin.hasPlayServices();
      onUserInfoGet(await GoogleSignin.signIn());
      store.setSignedIn(true);
    } catch (error) {
      // TODO manage errors
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  }, [store, onUserInfoGet]);

  if (store.loading) {
    return <CenteredLoading />;
  }

  if (store.signedIn) {
    return null;
  }

  return (
    <View>
      <View style={theme.padding4x}>
        <Text style={theme.colorSecondaryText}>
          {i18n.t('settings.youtubeImporter.description')}
        </Text>
      </View>
      <Button
        text={i18n.t('settings.youtubeImporter.connect')}
        onPress={signIn}
      />
    </View>
  );
});

export default GoogleSignInComponent;
