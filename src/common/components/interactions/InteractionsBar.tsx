import { observer } from 'mobx-react';
import React from 'react';
import { View } from 'react-native';
import type BlogModel from '../../../blogs/BlogModel';
import type CommentModel from '../../../comments/v2/CommentModel';
import type ActivityModel from '../../../newsfeed/ActivityModel';
import ThemedStyles from '../../../styles/ThemedStyles';
import abbrev from '../../helpers/abbrev';
import i18n from '../../services/i18n.service';
import MText from '../MText';
import PressableScale from '../PressableScale';

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
  return (
    <View style={containerStyle}>
      {entity['thumbs:up:count'] > 0 && (
        <PressableScale style={buttonStyle} onPress={onShowUpVotesPress}>
          <MText style={textStyle}>
            <MText style={countStyle}>
              {abbrev(entity['thumbs:up:count'], 1)}
            </MText>{' '}
            {i18n.t('interactions.upVotes', {
              count: entity['thumbs:up:count'],
            })}
          </MText>
        </PressableScale>
      )}
      {entity['thumbs:down:count'] > 0 && (
        <PressableScale style={buttonStyle} onPress={onShowDownVotesPress}>
          <MText style={textStyle}>
            <MText style={countStyle}>
              {abbrev(entity['thumbs:down:count'], 1)}
            </MText>{' '}
            {i18n.t('interactions.downVotes', {
              count: entity['thumbs:down:count'],
            })}
          </MText>
        </PressableScale>
      )}
      {entity.reminds > 0 && (
        <PressableScale style={buttonStyle} onPress={onShowRemindsPress}>
          <MText style={textStyle}>
            <MText style={countStyle}>{abbrev(entity.reminds, 1)}</MText>{' '}
            {i18n.t('interactions.reminds', {
              count: entity.reminds,
            })}
          </MText>
        </PressableScale>
      )}
      {entity.quotes > 0 && (
        <PressableScale style={buttonStyle} onPress={onShowQuotesPress}>
          <MText style={textStyle}>
            <MText style={countStyle}>{abbrev(entity.quotes, 1)}</MText>{' '}
            {i18n.t('interactions.quotes', {
              count: entity.quotes,
            })}
          </MText>
        </PressableScale>
      )}
    </View>
  );
});

const buttonStyle = ThemedStyles.combine('marginLeft2x', 'paddingVertical3x');
const containerStyle = ThemedStyles.combine(
  'rowJustifyStart',
  'bgPrimaryBackground',
  'paddingLeft2x',
  'borderTopHair',
  'bcolorPrimaryBorder',
);
const textStyle = ThemedStyles.combine('colorSecondaryText', 'fontM');
const countStyle = ThemedStyles.combine(
  'colorPrimaryText',
  'fontM',
  'fontMedium',
);
