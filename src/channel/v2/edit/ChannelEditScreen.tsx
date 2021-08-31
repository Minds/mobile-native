import React, { useCallback, useEffect, useLayoutEffect } from 'react';
import ThemedStyles, { useStyle } from '../../../styles/ThemedStyles';
import { observer, useLocalStore } from 'mobx-react';
import {
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from 'react-native';
import SmallCircleButton from '../../../common/components/SmallCircleButton';
import * as Progress from 'react-native-progress';
import LabeledComponent from '../../../common/components/LabeledComponent';
import isIphoneX from '../../../common/helpers/isIphoneX';
import SettingInput from '../../../common/components/SettingInput';
import i18n from '../../../common/services/i18n.service';
import { ChannelStoreType } from '../createChannelStore';
import SaveButton from '../../../common/components/SaveButton';
import LocationAutoSuggest from '../../../common/components/LocationAutoSuggest';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { NavigationProp } from '@react-navigation/native';

type PropsType = {
  route: any;
  navigation: NavigationProp<any>;
  store: any;
};

const createEditChannelStore = () => ({
  loaded: false,
  briefDescription: '',
  setBriefDescription(briefDescription) {
    this.briefDescription = briefDescription;
  },
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
      this.briefDescription = channelStore.channel.briefdescription;
    }
    this.setLoaded(true);
  },
});

const Avatar = observer(({ route }: PropsType) => {
  const store = route.params.store;
  const avatarSource = store.channel?.getAvatarSource();

  const onAvatarUpload = useCallback(
    () => route.params.store.upload('avatar'),
    [route.params.store],
  );

  const inside = (
    <View style={styles.tapOverlayView}>
      {store.uploading && store.avatarProgress ? (
        <Progress.Pie progress={store.avatarProgress} size={36} />
      ) : (
        <SmallCircleButton
          name="camera"
          style={styles.avatarSmallButton}
          onPress={onAvatarUpload}
        />
      )}
    </View>
  );

  return (
    <ImageBackground
      source={avatarSource}
      style={useStyle({
        width: 80,
        aspectRatio: 1,
        borderRadius: 100,
        overflow: 'hidden',
      })}>
      {inside}
    </ImageBackground>
  );
});

const Banner = observer(({ route }: PropsType) => {
  const store = route.params.store;
  const bannerSource = store.channel?.getBannerSource();

  const onBannerUpload = useCallback(
    () => route.params.store.upload('banner'),
    [route.params.store],
  );

  const inside = (
    <View style={styles.tapOverlayView}>
      {store.uploading && store.bannerProgress ? (
        <Progress.Pie progress={store.bannerProgress} size={36} />
      ) : (
        <SmallCircleButton
          name="camera"
          style={styles.avatarSmallButton}
          onPress={onBannerUpload}
        />
      )}
    </View>
  );

  return (
    <ImageBackground
      source={bannerSource}
      style={useStyle({ width: '100%', aspectRatio: 2.2 })}>
      {inside}
    </ImageBackground>
  );
});

const Bio = observer(({ route, navigation, store }: PropsType) => (
  <SettingInput
    placeholder={i18n.t('channel.edit.bio')}
    onChangeText={store.setBriefDescription}
    value={store.briefDescription}
    testID="displayNameInput"
    wrapperBorder={useStyle('borderTop')}
    multiline={true}
  />
));

const About = observer(({ store }: PropsType) => {
  const theme = ThemedStyles.style;

  return (
    <>
      {!store.editingCity && (
        <SettingInput
          placeholder={i18n.t('channel.edit.displayName')}
          onChangeText={store.setDisplayName}
          value={store.displayName}
          testID="displayNameInput"
          wrapperBorder={theme.borderTop}
        />
      )}
      {!store.editingCity && (
        <SettingInput
          placeholder={i18n.t('channel.edit.dob')}
          onChangeText={store.setDob}
          value={store.dob}
          testID="dobInput"
          wrapperBorder={theme.borderTop}
          inputType="dateInput"
        />
      )}
      <LocationAutoSuggest
        value={store.city}
        onChangeText={store.setCity}
        onEdit={store.setEditingCity}
        wrapperBorder={theme.borderBottom}
      />
    </>
  );
});

const ChannelEditScreen = (props: PropsType) => {
  const { navigation, route } = props;
  const theme = ThemedStyles.style;
  const insets = useSafeAreaInsets();
  const store = useLocalStore(createEditChannelStore);

  const save = useCallback(async () => {
    store.setLoaded(false);
    await route.params.store.save({
      name: store.displayName,
      city: store.city,
      dob: store.dob,
      briefdescription: store.briefDescription,
    });
    store.setLoaded(true);
    navigation.goBack();
  }, [store, navigation, route.params.store]);

  useEffect(() => {
    const params = route.params;
    if (params) {
      store.initialLoad(params.store);
    }
  }, [route, store]);

  /**
   * Set save button on header right
   */
  useLayoutEffect(
    () =>
      navigation.setOptions({
        headerRight: () => <SaveButton onPress={save} />,
        title: i18n.t('channel.editChannel'),
        headerLeft:
          Platform.OS === 'ios'
            ? () => (
                <Icon
                  name="close"
                  style={theme.colorPrimaryText}
                  size={25}
                  onPress={navigation.goBack}
                />
              )
            : undefined,
        headerHideBackButton: Platform.OS === 'ios',
      }),
    [navigation],
  );

  useEffect(() => {
    const params = route.params;
    if (params) {
      store.initialLoad(params.store);
    }
  }, [route, store]);

  return (
    <ScrollView
      style={useStyle('flexContainer', 'bgPrimaryBackground')}
      contentContainerStyle={useStyle({
        paddingBottom: insets.bottom + 100,
      })}
      keyboardShouldPersistTaps="handled">
      <KeyboardAvoidingView
        style={useStyle('flexContainer', 'paddingTop3x')}
        behavior="position"
        keyboardVerticalOffset={isIphoneX ? 100 : 64}>
        <LabeledComponent label={'Banner'} labelStyle={styles.labelStyle}>
          <Banner {...props} store={store} />
        </LabeledComponent>
        <LabeledComponent
          label={'Avatar'}
          labelStyle={styles.labelStyle}
          wrapperStyle={theme.paddingBottom2x}>
          <View style={theme.paddingLeft4x}>
            <Avatar {...props} store={store} />
          </View>
        </LabeledComponent>
        <Bio {...props} store={store} />
        <About {...props} store={store} />
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

const styles = ThemedStyles.create({
  contentContainerStyle: ['paddingBottom10x'],
  labelStyle: ['paddingLeft4x', 'paddingBottom2x'],
  tapOverlayView: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ChannelEditScreen;
