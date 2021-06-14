import { observer, useLocalStore } from 'mobx-react';
import React, { forwardRef } from 'react';
import { View, Text } from 'react-native';
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

type PropsType = {
  entity: ActivityModel;
};

const renderItemUser = (row: { item: any; index: number }) => {
  return <DiscoveryUser row={row} />;
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
const mapActivity = data =>
  data.map(d => {
    return ActivityModel.create(d);
  });

type Interactions = 'upVotes' | 'downVotes' | 'reminds' | 'quotes';

/**
 * Interaction modals
 */
export default observer(
  forwardRef(function InteractionsModal({ entity }: PropsType, ref: any) {
    const store = useLocalStore(() => ({
      visible: false,
      interaction: 'upVotes',
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

    const dataField = isVote ? 'votes' : 'entities';

    return (
      <Modal
        isVisible={store.visible}
        useNativeDriver={true}
        onBackdropPress={store.hide}>
        <View style={containerStyle}>
          <Text style={titleStyle}>
            {capitalize(
              i18n.t(`interactions.${store.interaction}`, { count: 2 }),
            )}
          </Text>
          <OffsetList
            fetchEndpoint={store.endpoint}
            endpointData={dataField}
            params={store.opts}
            map={isVote ? mapUser : mapActivity}
            renderItem={isVote ? renderItemUser : renderItemActivity}
            offsetField={'next-page'}
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
