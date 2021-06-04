import { observer, useLocalStore } from 'mobx-react';
import React, { forwardRef } from 'react';
import { View, Text } from 'react-native';
import Modal from 'react-native-modal';
import UserModel from '../../../channel/UserModel';
import DiscoveryUser from '../../../discovery/DiscoveryUserNew';
import type ActivityModel from '../../../newsfeed/ActivityModel';
import ThemedStyles from '../../../styles/ThemedStyles';
import capitalize from '../../helpers/capitalize';
import i18n from '../../services/i18n.service';
import OffsetList from '../OffsetList';

type PropsType = {
  entity: ActivityModel;
};

const renderItem = (row: { item: any; index: number }) => {
  const r = { item: UserModel.checkOrCreate(row.item.actor), index: row.index };
  return <DiscoveryUser row={r} />;
};

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
        return `api/v3/votes/list/${entity.guid}`; //TODO: change according interaction
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

    const opts = {
      limit: 24,
      direction: store.interaction === 'upVotes' ? 'up' : 'down',
    };
    const dataField = 'votes';

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
            params={opts}
            renderItem={renderItem}
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
  'backgroundPrimary',
  'padding3x',
  'borderRadius5x',
);
