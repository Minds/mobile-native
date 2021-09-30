import { observer, useLocalStore } from 'mobx-react';
import React, { forwardRef } from 'react';
import { View } from 'react-native';
import Modal from 'react-native-modal';

import DiscoveryUser from '../../../discovery/DiscoveryUserNew';
import UserModel from '../../../channel/UserModel';
import ActivityModel from '../../../newsfeed/ActivityModel';
import ThemedStyles from '../../../styles/ThemedStyles';
import capitalize from '../../helpers/capitalize';
import i18n from '../../services/i18n.service';
import OffsetList from '../OffsetList';
import Activity from '../../../newsfeed/activity/Activity';
import navigationService from '../../../navigation/NavigationService';
import type BaseModel from '../../BaseModel';
import MText from '../MText';

type PropsType = {
  entity: BaseModel;
};

const renderItemUser = (row: { item: any; index: number }) => {
  return <DiscoveryUser row={row} navigation={navigationService} />;
};

const renderItemActivity = (row: { item: any; index: number }) => {
  return (
    <Activity
      entity={row.item}
      hideTabs={true}
      hideRemind={true}
      navigation={navigationService}
    />
  );
};

const mapUser = data => data.map(d => UserModel.create(d.actor));
const mapSubscriber = data => data.map(d => UserModel.create(d));
const mapActivity = data =>
  data.map(d => {
    return ActivityModel.create(d);
  });

type Interactions =
  | 'upVotes'
  | 'downVotes'
  | 'reminds'
  | 'quotes'
  | 'subscribers';

/**
 * Interaction modals
 */
export default observer(
  forwardRef(function InteractionsModal({ entity }: PropsType, ref: any) {
    const store = useLocalStore(() => ({
      visible: false,
      interaction: 'upVotes' as Interactions,
      offset: '' as any,
      show() {
        store.visible = true;
      },
      hide() {
        store.visible = false;
      },
      setInteraction(interaction: Interactions) {
        store.interaction = interaction;
      },
      get endpoint() {
        return store.interaction === 'upVotes' ||
          store.interaction === 'downVotes'
          ? `api/v3/votes/list/${entity.guid}`
          : store.interaction === 'subscribers'
          ? `api/v3/subscriptions/graph/${entity.guid}/subscribers`
          : 'api/v3/newsfeed';
      },
      get opts() {
        const opts: any = {
          limit: 24,
        };

        if (store.interaction === 'reminds') {
          opts.remind_guid = entity.guid;
          opts.hide_reminds = false;
        } else if (store.interaction === 'quotes') {
          opts.quote_guid = entity.guid;
        } else {
          opts.direction = store.interaction === 'upVotes' ? 'up' : 'down';
        }
        return opts;
      },
      get offsetField() {
        let offsetField = 'next-page';
        if (store.interaction === 'subscribers') {
          offsetField = 'from_timestamp';
        }
        return offsetField;
      },
      setOffset(offset: any) {
        this.offset = offset;
      },
    }));

    React.useImperativeHandle(ref, () => ({
      show: (interaction: Interactions) => {
        store.setInteraction(interaction);
        store.show();
      },
      hide: () => {
        store.hide();
      },
    }));

    const isVote =
      store.interaction === 'upVotes' || store.interaction === 'downVotes';

    const isSubscriber = store.interaction === 'subscribers';

    const dataField = isVote ? 'votes' : 'entities';

    return (
      <Modal
        isVisible={store.visible}
        useNativeDriver={true}
        onBackdropPress={store.hide}
      >
        <View style={containerStyle}>
          <MText style={titleStyle}>
            {capitalize(
              i18n.t(`interactions.${store.interaction}`, { count: 2 }),
            )}
          </MText>
          <OffsetList
            fetchEndpoint={store.endpoint}
            endpointData={dataField}
            params={store.opts}
            map={isVote ? mapUser : isSubscriber ? mapSubscriber : mapActivity}
            renderItem={
              isVote || isSubscriber ? renderItemUser : renderItemActivity
            }
            offsetField={store.offsetField}
          />
        </View>
      </Modal>
    );
  }),
);

const titleStyle = ThemedStyles.combine(
  'fontXXL',
  'marginLeft2x',
  'marginBottom',
);

const containerStyle = ThemedStyles.combine(
  'height75',
  'bgPrimaryBackground',
  'padding3x',
  'borderRadius5x',
);
