import { observer, useLocalStore } from 'mobx-react';
import React, { forwardRef, useCallback } from 'react';
import { View } from 'react-native';

import BaseModel from '../../BaseModel';
import capitalize from '../../helpers/capitalize';
import MText from '../MText';
import BottomSheet from '../bottom-sheet/BottomSheet';
import Handle from '../bottom-sheet/Handle';
import Interactions from './Interactions';
import sp from '~/services/serviceProvider';

type Interactions =
  | 'upVotes'
  | 'downVotes'
  | 'reminds'
  | 'quotes'
  | 'channelSubscribers'
  | 'channelSubscriptions'
  | 'subscribers'
  | 'subscribersYouKnow';

type PropsType = {
  entity: BaseModel;
  modal?: boolean;
  withoutInsets?: boolean;
  snapPoints?: any;
  keepOpen?: boolean;
};

export interface InteractionsActionSheetHandles {
  show(interactions: Interactions): void;

  hide(): void;
}

export const getTitle = (interaction: Interactions) => {
  switch (interaction) {
    case 'channelSubscribers':
      return sp.i18n.t('subscribers');
    case 'channelSubscriptions':
      return sp.i18n.t('subscriptions');
    default:
      return sp.i18n.t(`interactions.${interaction}`, { count: 2 });
  }
};

/**
 * Interactions Action Sheet
 * @param props
 * @param ref
 */
const InteractionsBottomSheet: React.ForwardRefRenderFunction<
  InteractionsActionSheetHandles,
  PropsType
> = (props: PropsType, ref) => {
  // =====================| STATES & VARIABLES |=====================>
  const bottomSheetRef = React.useRef<any>(null);
  // whether the bottomsheet contents should be kept. defaults to true
  const keepOpen = typeof props.keepOpen === 'boolean' ? props.keepOpen : true;
  const entity = props.entity;
  const store = useLocalStore(() => ({
    visible: false,
    interaction: 'upVotes' as Interactions,
    setInteraction(interaction: Interactions) {
      store.interaction = interaction;
    },
    setVisibility(visible: boolean) {
      this.visible = visible;
    },
    show() {
      bottomSheetRef.current?.expand();
      store.visible = true;
    },
    hide() {
      bottomSheetRef.current?.close();
      /**
       * we don't turn visibility off, because then
       * the offsetlist will be unmounted and the data,
       * will be reset. we want to keep the data
       **/
      if (!keepOpen) {
        store.visible = false;
      }
    },
  }));

  // =====================| METHODS |=====================>
  React.useImperativeHandle(ref, () => ({
    show: (interaction: Interactions) => {
      store.setInteraction(interaction);
      /**
       * if the list was already visible, refresh its existing data,
       * other wise just show the list
       **/
      store.show();
    },
    hide: () => {
      store.hide();
    },
  }));

  const close = React.useCallback(
    () => bottomSheetRef.current?.close(),
    [bottomSheetRef],
  );

  const onBottomSheetVisibilityChange = useCallback(
    (visible: number) => {
      const shouldShow = visible >= 0;

      if (keepOpen && shouldShow) {
        store.setVisibility(shouldShow);
      } else {
        store.setVisibility(shouldShow);
      }
    },
    [keepOpen, store],
  );

  // =====================| RENDERS |=====================>
  const Header = useCallback(
    () => (
      <Handle>
        <View style={styles.navbarContainer}>
          <MText style={styles.titleStyle}>
            {store.visible ? capitalize(getTitle(store.interaction)) : ''}
          </MText>
        </View>
      </Handle>
    ),
    [store.interaction, store.visible],
  );

  return (
    <BottomSheet
      ref={bottomSheetRef}
      handleComponent={Header}
      onChange={onBottomSheetVisibilityChange}
      snapPoints={props.snapPoints}>
      <View style={styles.container}>
        {store.visible && (
          <Interactions
            interaction={store.interaction}
            entity={entity}
            onCancel={close}
          />
        )}
      </View>
    </BottomSheet>
  );
};

const styles = sp.styles.create({
  container: ['bgPrimaryBackground', 'flexContainer'],
  navbarContainer: ['padding2x', 'alignCenter', 'bgPrimaryBackground'],
  titleStyle: ['fontXL', 'marginLeft2x', 'marginBottom', 'bold'],
  cancelContainer: ['positionAbsoluteBottom', 'paddingHorizontal2x'],
  contentContainerStyle: { paddingBottom: 200 },
});
export default observer(forwardRef(InteractionsBottomSheet));
