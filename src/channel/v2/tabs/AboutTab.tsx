import React, { useEffect } from 'react';
import { observer, useLocalStore } from 'mobx-react';
import { ChannelStoreType } from '../createChannelStore';
import { View } from 'react-native';
import moment from 'moment-timezone';
import ThemedStyles from '../../../styles/ThemedStyles';
import LabeledComponent from '../../../common/components/LabeledComponent';
import i18n from '../../../common/services/i18n.service';
import ChannelBadges from '../../badges/ChannelBadges';
import CenteredLoading from '../../../common/components/CenteredLoading';
import abbrev from '../../../common/helpers/abbrev';
import SocialLinks from '../../../common/components/SocialLinks';
import Tags from '../../../common/components/Tags';
import { useIsFocused } from '@react-navigation/core';
import { withErrorBoundary } from '../../../common/components/ErrorBoundary';
import MText from '../../../common/components/MText';

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

  const { channel } = store;

  if (!channel) {
    return <View></View>;
  }

  // re-render on focus (in case the user was edited)
  useIsFocused();

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

  const tags = channel?.tags.join(' #');
  const margin = theme.marginVertical3x;
  const hasBadges =
    channel.pro || channel.plus || channel.verified || channel.founder;

  return (
    <View style={[theme.paddingLeft4x, theme.paddingTop2x]}>
      {channel?.briefdescription !== '' && (
        <LabeledComponent label={i18n.t('channel.edit.bio')}>
          <Tags navigation={navigation}>{channel?.briefdescription}</Tags>
        </LabeledComponent>
      )}

      {channel?.tags.length > 0 && (
        <LabeledComponent
          label={i18n.t('channel.edit.hashtags')}
          wrapperStyle={margin}>
          <MText>{`#${tags}`}</MText>
        </LabeledComponent>
      )}

      <LabeledComponent label={i18n.t('joined')} wrapperStyle={margin}>
        <MText>
          {channel?.time_created
            ? moment(parseInt(channel.time_created, 10) * 1000).format('MMM Y')
            : ''}
        </MText>
      </LabeledComponent>

      {channel?.dob && (
        <LabeledComponent
          label={i18n.t('channel.edit.dob')}
          wrapperStyle={margin}>
          <MText>{channel?.dob}</MText>
        </LabeledComponent>
      )}

      {hasBadges && (
        <LabeledComponent label={i18n.t('channel.badges')}>
          <View style={theme.rowJustifyStart}>
            <ChannelBadges channel={channel} />
          </View>
        </LabeledComponent>
      )}

      <LabeledComponent
        label={i18n.t('discovery.filters.groups')}
        wrapperStyle={margin}>
        <MText>{localStore.groupCount}</MText>
      </LabeledComponent>

      <LabeledComponent label={i18n.t('subscribers')}>
        <MText>{channel.subscribers_count}</MText>
      </LabeledComponent>

      <LabeledComponent label={i18n.t('views')} wrapperStyle={margin}>
        <MText>{abbrev(channel.impressions, 1)}</MText>
      </LabeledComponent>

      <LabeledComponent
        label={i18n.t('subscriptions')}
        wrapperStyle={theme.marginBottom2x}>
        <MText>{channel.subscriptions_count}</MText>
      </LabeledComponent>

      {channel.social_profiles!.length > 0 && (
        <LabeledComponent
          label={i18n.t('channel.edit.links')}
          wrapperStyle={theme.marginBottom2x}>
          <SocialLinks socialLinks={channel.social_profiles} />
        </LabeledComponent>
      )}
    </View>
  );
});

export default withErrorBoundary(AboutTab);
