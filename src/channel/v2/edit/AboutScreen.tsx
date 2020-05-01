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
import LocationAutoSuggest from '../../../common/components/LocationAutoSuggest';

type AboutScreenRouteProp = RouteProp<EditChannelStackParamList, 'About'>;

type AboutScreenNavigationProp = StackNavigationProp<
  EditChannelStackParamList,
  'About'
>;

type PropsType = {
  route: AboutScreenRouteProp;
  navigation: AboutScreenNavigationProp;
};

const createAboutChannelStore = () => {
  const store = {
    loaded: false,
    displayName: '',
    city: '',
    dob: '',
    editingCity: false,
    setEditingCity(editingCity: boolean) {
      this.editingCity = editingCity;
      return editingCity;
    },
    setLoaded(loaded) {
      this.loaded = loaded;
    },
    setDisplayName(displayName) {
      this.displayName = displayName;
    },
    setCity(city) {
      this.city = city;
    },
    setDob(dob) {
      this.dob = dob;
    },
    initialLoad(channelStore: ChannelStoreType) {
      if (channelStore.channel) {
        this.setDisplayName(channelStore.channel.name);
        this.setCity(channelStore.channel.city);
        this.setDob(channelStore.channel.dob);
        this.setLoaded(true);
      }
    },
  };
  return store;
};

const AboutScreen = observer(({ route, navigation }: PropsType) => {
  const store = useLocalStore(createAboutChannelStore);
  const theme = ThemedStyles.style;

  const save = useCallback(async () => {
    store.setLoaded(false);
    await route.params.store.save({
      name: store.displayName,
      city: store.city,
      dob: store.dob,
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
    headerRight: () => (
      <Text onPress={save} style={[theme.colorLink, theme.fontL, theme.bold]}>
        {i18n.t('save')}
      </Text>
    ),
  });

  return (
    <ScrollView
      style={[theme.flexContainer, theme.backgroundPrimary]}
      keyboardShouldPersistTaps={true}>
      <KeyboardAvoidingView
        style={[theme.flexContainer, theme.paddingTop3x]}
        behavior="position"
        keyboardVerticalOffset={isIphoneX ? 100 : 64}>
        {!store.editingCity && (
          <SettingInput
            placeholder={i18n.t('channel.edit.displayName')}
            onChangeText={store.setDisplayName}
            value={store.displayName}
            testID="displayNameInput"
            wrapperBorder={theme.borderTop}
            onFocus={() => store.setDisplayName('')}
          />
        )}
        {!store.editingCity && (
          <SettingInput
            placeholder={i18n.t('channel.edit.dob')}
            onChangeText={store.setDob}
            value={store.dob}
            testID="dobInput"
            wrapperBorder={[theme.borderTop, theme.borderBottom]}
            onFocus={() => store.setDob('')}
            inputType="dateInput"
          />
        )}
        <LocationAutoSuggest
          value={store.city}
          onChangeText={store.setCity}
          onEdit={store.setEditingCity}
        />
      </KeyboardAvoidingView>
    </ScrollView>
  );
});

export default AboutScreen;
