import React, { PureComponent, useEffect } from 'react';

import { StyleSheet, View, ActionSheetIOS } from 'react-native';

import { inject, observer } from 'mobx-react';

import ThumbUpAction from './actions/ThumbUpAction';
import ThumbDownAction from './actions/ThumbDownAction';
import WireAction from './actions/WireAction';
import CommentsAction from './actions/CommentsAction';
import RemindAction from './actions/RemindAction';
import BoostAction from './actions/BoostAction';

import { CommonStyle } from '../../styles/Common';
import featuresService from '../../common/services/features.service';
import BaseModel from '../../common/BaseModel';
import type ActivityModel from '../ActivityModel';
import type UserStore from '../../auth/UserStore';
import { useLegacyStores } from '../../common/hooks/use-stores';
import { useNavigation } from '@react-navigation/native';
import ThemedStyles from '../../styles/ThemedStyles';
import { Text } from 'react-native-animatable';
import CommentsEntityOutlet from '../../comments/CommentsEntityOutlet';
import { UserError } from '../../common/UserError';

type PropsType = {
  entity: ActivityModel;
  showCommentsOutlet?: boolean;
};

export const Actions = observer((props: PropsType) => {
  const { user } = useLegacyStores();
  const navigation = useNavigation();

  useEffect(() => {}, [props.showCommentsOutlet]);

  const entity = props.entity;
  const isOwner = user.me.guid === entity.owner_guid;
  const hasCrypto = featuresService.has('crypto');
  const isScheduled = BaseModel.isScheduled(
    parseInt(entity.time_created, 10) * 1000,
  );

  return (
    <View>
      <View style={ThemedStyles.style.flexContainer}>
        {entity && (
          <View style={styles.container}>
            <ThumbUpAction entity={entity} />
            <ThumbDownAction entity={entity} />
            <CommentsAction
              entity={entity}
              navigation={navigation}
              testID={
                props.entity.text === 'e2eTest' ? 'ActivityCommentButton' : ''
              }
            />
            <RemindAction entity={entity} />

            <View style={{ flex: 1 }}></View>

            {!isOwner && hasCrypto && (
              <WireAction owner={entity.ownerObj} navigation={navigation} />
            )}

            {isOwner && hasCrypto && !isScheduled && (
              <BoostAction entity={entity} navigation={navigation} />
            )}
          </View>
        )}
      </View>
      {props.showCommentsOutlet ? (
        <CommentsEntityOutlet entity={entity}></CommentsEntityOutlet>
      ) : undefined}
    </View>
  );
});

export default Actions;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 0,
    paddingTop: featuresService.has('crypto') ? 4 : 8,
    paddingBottom: featuresService.has('crypto') ? 4 : 8,
  },
  avatar: {
    height: 46,
    width: 46,
    borderRadius: 23,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#EEE',
  },
});
