import React, { useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import { ImageBackground, Platform, View } from 'react-native';
import * as Progress from 'react-native-progress';
import Icon from '@expo/vector-icons/MaterialIcons';
import { NavigationProp } from '@react-navigation/native';
import { observer, useLocalStore } from 'mobx-react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import SmallCircleButton from '~/common/components/SmallCircleButton';
import LabeledComponent from '~/common/components/LabeledComponent';
import { ChannelStoreType } from '../createChannelStore';
import SaveButton from '~/common/components/SaveButton';
import LocationAutoSuggest from '~/common/components/LocationAutoSuggest';
import InputContainer from '~/common/components/InputContainer';
import useDebouncedCallback from '~/common/hooks/useDebouncedCallback';
import { withErrorBoundaryScreen } from '~/common/components/ErrorBoundaryScreen';
import { B1, Button, Row } from '~/common/ui';
import FloatingInput from '~/common/components/FloatingInput';
import { KeyVal, buildKeyVal } from '~/channel/SocialProfileMeta';
import sp from '~/services/serviceProvider';
import { useStyle } from '~/styles/hooks';

type PropsType = {
  route: any;
  navigation: NavigationProp<any>;
  store: any;
};

const createEditChannelStore = () => ({
  loaded: false,
  briefDescription: '',
  socialLinks: [] as Array<KeyVal>,
  setBriefDescription(briefDescription) {
    this.briefDescription = briefDescription;
  },
  displayName: '',
  city: '',
  dob: undefined as Date | undefined,
  editingCity: false,
  setEditingCity(editingCity: boolean) {
    this.editingCity = editingCity;
    return editingCity;
  },
  setSocialLinks(socialLinks) {
    this.socialLinks = socialLinks;
  },
  addSocialLink(link: string) {
    this.socialLinks.push(buildKeyVal(link));
  },
  removeSocialLink(index: number) {
    this.socialLinks.splice(index, 1);
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
    this.dob = dob ? (dob instanceof Date ? dob : new Date(dob)) : undefined;
  },
  initialLoad(channelStore: ChannelStoreType) {
    if (channelStore.channel) {
      this.setDisplayName(channelStore.channel.name);
      this.setCity(channelStore.channel.city);
      this.setDob(channelStore.channel.dob);
      this.setLoaded(true);
      this.setSocialLinks(channelStore.channel.social_profiles);
      this.briefDescription = channelStore.channel.briefdescription;
    }
    this.setLoaded(true);
  },
});

const Avatar = observer(({ route }: PropsType) => {
  const { store } = route.params ?? {};
  const avatarSource = store.channel?.getAvatarSource();

  const onAvatarUpload = useCallback(() => store?.upload('avatar'), [store]);

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

const SocialLinks = observer(({ store }: PropsType) => {
  const ref = useRef<any>(null);
  return (
    <View>
      <B1 color="secondary" vertical="M" horizontal="L">
        Social Links
      </B1>
      <FloatingInput
        ref={ref}
        title="Add Social Link"
        defaultValue="https://"
        hideKeyboard
        onSubmitEditing={event => {
          store.addSocialLink(event.nativeEvent.text);
          ref.current?.hide();
        }}
      />
      <Row align="baseline" horizontal="L" bottom="XL">
        {store.socialLinks.map((link, index) => (
          <LinkChip link={link} onPress={() => store.removeSocialLink(index)} />
        ))}
      </Row>
      <Button
        onPress={() => {
          ref.current?.show();
        }}
        size="tiny"
        align="center">
        Add Link
      </Button>
    </View>
  );
});

const LinkChip = ({ link, onPress }) => (
  <View style={styles.link}>
    <B1 right="S">{link.value}</B1>
    <Icon
      name="close"
      size={22}
      onPress={onPress}
      style={sp.styles.style.colorPrimaryText}
    />
  </View>
);

const Banner = observer(({ route }: PropsType) => {
  const { store } = route.params ?? {};
  const bannerSource = store?.channel?.getBannerSource();

  const onBannerUpload = useCallback(() => store?.upload('banner'), [store]);

  const inside = (
    <View style={styles.tapOverlayView}>
      {store?.uploading && store?.bannerProgress ? (
        <Progress.Pie progress={store?.bannerProgress} size={36} />
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

const Bio = observer(({ store }: PropsType) => (
  <InputContainer
    placeholder={sp.i18n.t('channel.edit.bio')}
    onChangeText={store.setBriefDescription}
    value={store.briefDescription}
    testID="displayNameInput"
    noBottomBorder
    multiline={true}
  />
));

const About = observer(
  ({ store, onFocusLocation }: PropsType & { onFocusLocation: () => void }) => {
    const theme = sp.styles.style;

    return (
      <>
        <InputContainer
          placeholder={sp.i18n.t('channel.edit.displayName')}
          onChangeText={store.setDisplayName}
          value={store.displayName}
          testID="displayNameInput"
          noBottomBorder
        />

        <InputContainer
          placeholder={sp.i18n.t('channel.edit.dob')}
          onChangeText={store.setDob}
          value={store.dob}
          testID="dobInput"
          noBottomBorder
          dateFormat={'ISOString'}
          inputType="dateInput"
        />
        {store.loaded && (
          <LocationAutoSuggest
            value={store.city}
            onChangeText={store.setCity}
            onEdit={store.setEditingCity}
            wrapperBorder={theme.borderBottom}
            onFocus={onFocusLocation}
          />
        )}
      </>
    );
  },
);

const ChannelEditScreen = (props: PropsType) => {
  const { navigation, route } = props;
  const theme = sp.styles.style;
  const insets = useSafeAreaInsets();
  const store = useLocalStore(createEditChannelStore);

  const listRef = React.useRef<any>(null);
  const { store: routeStore } = route.params ?? {};

  const save = useCallback(async () => {
    store.setLoaded(false);
    await routeStore?.save({
      name: store.displayName,
      city: store.city,
      dob: store.dob,
      briefdescription: store.briefDescription,
      social_profiles: store.socialLinks,
    });
    store.setLoaded(true);
    navigation.goBack();
  }, [store, routeStore, navigation]);

  useEffect(() => {
    if (routeStore) {
      store.initialLoad(routeStore);
    }
  }, [routeStore, store]);

  /**
   * Set save button on header right
   */
  useLayoutEffect(
    () =>
      navigation.setOptions({
        headerRight: () => <SaveButton onPress={save} />,
        title: sp.i18n.t('channel.editChannel'),
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
    [navigation, save, theme.colorPrimaryText],
  );

  const onFocusLocation = useDebouncedCallback(
    () => {
      listRef.current?.scrollToEnd({ animated: true });
    },
    1000,
    [],
  );

  return (
    <KeyboardAwareScrollView
      style={styles.scroll}
      ref={listRef}
      contentContainerStyle={{
        paddingBottom: insets.bottom + 50,
      }}
      keyboardShouldPersistTaps="handled">
      <View style={styles.container}>
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
        <About {...props} store={store} onFocusLocation={onFocusLocation} />
        <SocialLinks {...props} store={store} />
      </View>
    </KeyboardAwareScrollView>
  );
};

const styles = sp.styles.create({
  scroll: ['flexContainer', 'bgPrimaryBackground'],
  container: ['flexContainer', 'paddingTop3x'],
  contentContainerStyle: ['paddingBottom10x'],
  labelStyle: ['paddingLeft4x', 'paddingBottom2x'],
  link: [
    'rowJustifyCenter',
    'padding2x',
    'paddingHorizontal3x',
    'bcolorPrimaryBorder',
    'borderRadius20x',
    'border',
  ],
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

export default withErrorBoundaryScreen(ChannelEditScreen, 'ChannelEditScreen');
