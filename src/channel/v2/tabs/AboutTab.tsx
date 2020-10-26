import React, { useEffect } from 'react';
import { observer, useLocalStore } from 'mobx-react';
import { ChannelStoreType } from '../createChannelStore';
import { Text, View } from 'react-native';
import ThemedStyles from '../../../styles/ThemedStyles';
import LabeledComponent from '../../../common/components/LabeledComponent';
import i18n from '../../../common/services/i18n.service';
import ChannelBadges from '../../badges/ChannelBadges';
import CenteredLoading from '../../../common/components/CenteredLoading';
import abbrev from '../../../common/helpers/abbrev';

type PropsType = {
  store: ChannelStoreType;
  navigation: any;
};

const AboutTab = observer(({ store, navigation }: PropsType) => {
  const theme = ThemedStyles.style;
  const localStore = useLocalStore(() => ({
    groupCount: 0,
    loaded: false,
    init(groupCount: number) {
      this.groupCount = groupCount;
      this.loaded = true;
    },
  }));
  if (!store.channel) {
    return <View></View>;
  }

  useEffect(() => {
    if (!localStore.loaded) {
      const loadGroupCount = async () => {
        const count = await store.getGroupCount();
        localStore.init(count);
      };
      loadGroupCount();
    }
  }, [localStore, store]);

  if (!localStore.loaded) {
    return <CenteredLoading />;
  }

  const tags = store.channel?.tags.join(' #');

  const margin = theme.marginVertical3x;

  return (
    <View style={[theme.paddingLeft4x, theme.paddingTop2x]}>
      <LabeledComponent label={i18n.t('channel.edit.bio')}>
        <Text>{store.channel?.briefdescription}</Text>
      </LabeledComponent>
      <LabeledComponent
        label={i18n.t('channel.edit.hashtags')}
        wrapperStyle={margin}>
        <Text>{`#${tags}`}</Text>
      </LabeledComponent>
      <LabeledComponent label={i18n.t('channel.edit.location')}>
        <Text>{store.channel?.city}</Text>
      </LabeledComponent>
      <LabeledComponent
        label={i18n.t('channel.edit.dob')}
        wrapperStyle={margin}>
        <Text>{store.channel?.dob}</Text>
      </LabeledComponent>
      <LabeledComponent label={i18n.t('channel.badges')}>
        <ChannelBadges
          channel={store.channel}
          size={16}
          iconStyle={theme.colorPrimaryText}
        />
      </LabeledComponent>
      <LabeledComponent
        label={i18n.t('discovery.groups')}
        wrapperStyle={margin}>
        <Text>{localStore.groupCount}</Text>
      </LabeledComponent>
      <LabeledComponent label={i18n.t('subscribers')}>
        <Text>{store.channel.subscribers_count}</Text>
      </LabeledComponent>
      <LabeledComponent label={i18n.t('views')} wrapperStyle={margin}>
        <Text>{abbrev(store.channel.impressions, 1)}</Text>
      </LabeledComponent>
      <LabeledComponent
        label={i18n.t('subscriptions')}
        wrapperStyle={theme.marginBottom2x}>
        <Text>{store.channel.subscriptions_count}</Text>
      </LabeledComponent>
    </View>
  );
});

export default AboutTab;
