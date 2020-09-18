import React from 'react';

import { StyleSheet, View, Platform } from 'react-native';

import { observer } from 'mobx-react';

import ThumbUpAction from './actions/ThumbUpAction';
import ThumbDownAction from './actions/ThumbDownAction';
import WireAction from './actions/WireAction';
import CommentsAction from './actions/CommentsAction';
import RemindAction from './actions/RemindAction';
import BoostAction from './actions/BoostAction';

import featuresService from '../../common/services/features.service';
import BaseModel from '../../common/BaseModel';
import type ActivityModel from '../ActivityModel';
import { useLegacyStores } from '../../common/hooks/use-stores';
import { useNavigation } from '@react-navigation/native';
import ThemedStyles from '../../styles/ThemedStyles';
import CommentsEntityOutlet from '../../comments/CommentsEntityOutlet';

type PropsType = {
  entity: ActivityModel;
  showCommentsOutlet?: boolean;
  onPressComment?: () => void;
  shouldOpenComments?: boolean;
};

export const Actions = observer((props: PropsType) => {
  const theme = ThemedStyles.style;
  const { user } = useLegacyStores();
  const navigation = useNavigation();

  const entity = props.entity;
  const isOwner = user.me.guid === entity.owner_guid;
  const hasWire = Platform.OS !== 'ios';
  const hasCrypto = featuresService.has('crypto');
  const isScheduled = BaseModel.isScheduled(
    parseInt(entity.time_created, 10) * 1000,
  );

  return (
    <View>
      {entity && (
        <View style={[styles.container, theme.borderPrimary]}>
          <ThumbUpAction entity={entity} />
          <ThumbDownAction entity={entity} />
          <CommentsAction
            entity={entity}
            navigation={navigation}
            onPressComment={props.onPressComment}
            testID={
              props.entity.text === 'e2eTest' ? 'ActivityCommentButton' : ''
            }
            shouldOpenComments={props.shouldOpenComments}
          />
          <RemindAction entity={entity} />

          {!isOwner && hasCrypto && hasWire && (
            <WireAction owner={entity.ownerObj} navigation={navigation} />
          )}

          {isOwner && hasCrypto && !isScheduled && (
            <BoostAction entity={entity} navigation={navigation} />
          )}
        </View>
      )}
      {props.showCommentsOutlet ? (
        <CommentsEntityOutlet entity={entity} />
      ) : undefined}
    </View>
  );
});

export default Actions;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    // alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingHorizontal: 10,
    // backgroundColor: 'blue',
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  avatar: {
    height: 46,
    width: 46,
    borderRadius: 23,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#EEE',
  },
});
