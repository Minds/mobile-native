import React, { useEffect, useCallback } from 'react';
import i18n from '../../../common/services/i18n.service';
import ThemedStyles from '../../../styles/ThemedStyles';
import { observer, useLocalStore } from 'mobx-react';
import { ScrollView, KeyboardAvoidingView, Text } from 'react-native';
import isIphoneX from '../../../common/helpers/isIphoneX';
import SettingInput from '../../../common/components/SettingInput';
import CenteredLoading from '../../../common/components/CenteredLoading';
import type { RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

import type { EditChannelStackParamList } from './EditChannelStack';
import type { ChannelStoreType } from '../createChannelStore';
import SaveButton from '../../../common/components/SaveButton';

type BioScreenRouteProp = RouteProp<EditChannelStackParamList, 'Bio'>;

type BioScreenNavigationProp = StackNavigationProp<
  EditChannelStackParamList,
  'Bio'
>;

type PropsType = {
  route: BioScreenRouteProp;
  navigation: BioScreenNavigationProp;
};

const createAboutChannelStore = () => {
  const store = {
    loaded: false,
    briefDescription: '',
    setBriefDescription(briefDescription) {
      this.briefDescription = briefDescription;
    },
    setLoaded(loaded) {
      this.loaded = loaded;
    },
    initialLoad(channelStore: ChannelStoreType) {
      if (channelStore.channel) {
        this.briefDescription = channelStore.channel.briefdescription;
      }
      this.setLoaded(true);
    },
  };
  return store;
};

const BioScreen = observer(({ route, navigation }: PropsType) => {
  const store = useLocalStore(createAboutChannelStore);
  const theme = ThemedStyles.style;

  const save = useCallback(async () => {
    store.setLoaded(false);
    await route.params.store.save({
      briefdescription: store.briefDescription,
    });
    store.setLoaded(true);
  }, [store, route]);

  useEffect(() => {
    const params = route.params;
    if (params) {
      store.initialLoad(params.store);
    }
  }, [route, store]);

  if (!store.loaded) {
    return <CenteredLoading />;
  }

  /**
   * Set save button on header right
   */
  navigation.setOptions({
    headerRight: () => <SaveButton onPress={save} />,
  });

  return (
    <ScrollView
      style={[theme.flexContainer, theme.backgroundPrimary]}
      keyboardShouldPersistTaps={true}>
      <KeyboardAvoidingView
        style={[theme.flexContainer, theme.paddingTop3x]}
        behavior="position"
        keyboardVerticalOffset={isIphoneX ? 100 : 64}>
        <SettingInput
          placeholder={i18n.t('channel.briefDescription')}
          onChangeText={store.setBriefDescription}
          value={store.briefDescription}
          testID="displayNameInput"
          wrapperBorder={[theme.borderTop, theme.borderBottom]}
          selectTextOnFocus={true}
          multiline={true}
        />
      </KeyboardAvoidingView>
    </ScrollView>
  );
});

export default BioScreen;
