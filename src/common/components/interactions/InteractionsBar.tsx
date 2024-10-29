import { observer } from 'mobx-react';
import React from 'react';
import { View } from 'react-native';
import Counter from '~/newsfeed/activity/actions/Counter';
import type BlogModel from '../../../blogs/BlogModel';
import type CommentModel from '../../../comments/v2/CommentModel';
import type ActivityModel from '../../../newsfeed/ActivityModel';

import MText from '../MText';
import PressableScale from '../PressableScale';
import sp from '~/services/serviceProvider';

interface PropsType {
  entity: ActivityModel | CommentModel | BlogModel;
  onShowUpVotesPress: () => void;
  onShowDownVotesPress: () => void;
  onShowRemindsPress: () => void;
  onShowQuotesPress: () => void;
}
/**
 * Interactions Bar
 */
export default observer(function InteractionsBar({
  entity,
  onShowUpVotesPress,
  onShowDownVotesPress,
  onShowRemindsPress,
  onShowQuotesPress,
}: PropsType) {
  const i18n = sp.i18n;
  return (
    <View style={containerStyle}>
      {entity['thumbs:up:count'] > 0 && (
        <PressableScale
          innerStyle={buttonInnerStyle}
          style={buttonStyle}
          onPress={onShowUpVotesPress}>
          <Counter count={entity['thumbs:up:count']} style={countStyle} />
          <MText style={textStyle}>
            {' '}
            {i18n.t('interactions.upVotes', {
              count: entity['thumbs:up:count'],
            })}
          </MText>
        </PressableScale>
      )}
      {entity['thumbs:down:count'] > 0 && (
        <PressableScale
          innerStyle={buttonInnerStyle}
          style={buttonStyle}
          onPress={onShowDownVotesPress}>
          <Counter count={entity['thumbs:down:count']} style={countStyle} />
          <MText style={textStyle}>
            {' '}
            {i18n.t('interactions.downVotes', {
              count: entity['thumbs:down:count'],
            })}
          </MText>
        </PressableScale>
      )}
      {entity.reminds > 0 && (
        <PressableScale
          innerStyle={buttonInnerStyle}
          style={buttonStyle}
          onPress={onShowRemindsPress}>
          <Counter count={entity.reminds} style={countStyle} />
          <MText style={textStyle}>
            {' '}
            {i18n.t('interactions.reminds', {
              count: entity.reminds,
            })}
          </MText>
        </PressableScale>
      )}
      {entity.quotes > 0 && (
        <PressableScale
          innerStyle={buttonInnerStyle}
          style={buttonStyle}
          onPress={onShowQuotesPress}>
          <Counter count={entity.quotes} style={countStyle} />
          <MText style={textStyle}>
            {' '}
            {i18n.t('interactions.quotes', {
              count: entity.quotes,
            })}
          </MText>
        </PressableScale>
      )}
    </View>
  );
});

const buttonStyle = sp.styles.combine('marginLeft2x', 'paddingVertical3x');
const buttonInnerStyle = sp.styles.combine('rowJustifyCenter');
const containerStyle = sp.styles.combine(
  'rowJustifyStart',
  'bgPrimaryBackground',
  'paddingLeft2x',
  'borderTopHair',
  'bcolorPrimaryBorder',
);
const textStyle = sp.styles.combine('colorSecondaryText', 'fontM');
const countStyle = sp.styles.combine('colorPrimaryText', 'fontM', 'fontMedium');
