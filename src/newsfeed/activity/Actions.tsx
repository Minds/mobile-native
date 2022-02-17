import React from 'react';

import { StyleSheet, View, Platform } from 'react-native';

import { observer } from 'mobx-react';

import ThumbUpAction from './actions/ThumbUpAction';
import ThumbDownAction from './actions/ThumbDownAction';
import WireAction from './actions/WireAction';
import CommentsAction from './actions/CommentsAction';
import RemindAction from './actions/RemindAction';
import BoostAction from './actions/BoostAction';
import BaseModel from '../../common/BaseModel';
import type ActivityModel from '../ActivityModel';
import { useNavigation } from '@react-navigation/native';
import ThemedStyles from '../../styles/ThemedStyles';
import CommentsEntityOutlet from '../../comments/CommentsEntityOutlet';
import ShareAction from './actions/ShareAction';

type PropsType = {
  entity: ActivityModel;
  showCommentsOutlet?: boolean;
  hideCount?: boolean;
  onPressComment?: () => void;
  hideTabs?: boolean;
};

export const Actions = observer((props: PropsType) => {
  const navigation = useNavigation();

  if (props.hideTabs) {
    return null;
  }

  const entity = props.entity;
  const isOwner = entity.isOwner();
  const hasWire = Platform.OS !== 'ios';
  const isScheduled = BaseModel.isScheduled(
    parseInt(entity.time_created, 10) * 1000,
  );

  return (
    <View>
      {entity && (
        <View style={containerStyle}>
          <ThumbUpAction entity={entity} hideCount={props.hideCount} />
          <ThumbDownAction entity={entity} hideCount={props.hideCount} />
          <CommentsAction
            // hideCount={props.hideCount}
            entity={entity}
            navigation={navigation}
            onPressComment={props.onPressComment}
            testID={
              props.entity.text === 'e2eTest' ? 'ActivityCommentButton' : ''
            }
          />
          <RemindAction entity={entity} hideCount={props.hideCount} />

          <ShareAction entity={entity} />

          {!isOwner && hasWire && (
            <WireAction owner={entity.ownerObj} navigation={navigation} />
          )}

          {isOwner && !isScheduled && (
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
    justifyContent: 'space-around',
    paddingHorizontal: 16,
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

const containerStyle = ThemedStyles.combine(
  styles.container,
  'bcolorPrimaryBorder',
);
