import { observer } from 'mobx-react';
import React from 'react';
import { View, Text } from 'react-native';
import type BlogModel from '../../../blogs/BlogModel';
import type CommentModel from '../../../comments/v2/CommentModel';
import type ActivityModel from '../../../newsfeed/ActivityModel';
import ThemedStyles from '../../../styles/ThemedStyles';
import abbrev from '../../helpers/abbrev';
import i18n from '../../services/i18n.service';
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
          <Text style={textStyle}>
            <Text style={countStyle}>
              {abbrev(entity['thumbs:up:count'], 0)}
            </Text>{' '}
            {i18n.t('interactions.upVotes', {
              count: entity['thumbs:up:count'],
            })}
          </Text>
        </PressableScale>
      )}
      {entity['thumbs:down:count'] > 0 && (
        <PressableScale style={buttonStyle} onPress={onShowDownVotesPress}>
          <Text style={textStyle}>
            <Text style={countStyle}>
              {abbrev(entity['thumbs:down:count'], 0)}
            </Text>{' '}
            {i18n.t('interactions.downVotes', {
              count: entity['thumbs:down:count'],
            })}
          </Text>
        </PressableScale>
      )}
      {entity.reminds > 0 && (
        <PressableScale style={buttonStyle} onPress={onShowRemindsPress}>
          <Text style={textStyle}>
            <Text style={countStyle}>{abbrev(entity.reminds, 0)}</Text>{' '}
            {i18n.t('interactions.reminds', {
              count: entity.reminds,
            })}
          </Text>
        </PressableScale>
      )}
      {entity.quotes > 0 && (
        <PressableScale style={buttonStyle} onPress={onShowQuotesPress}>
          <Text style={textStyle}>
            <Text style={countStyle}>{abbrev(entity.quotes, 0)}</Text>{' '}
            {i18n.t('interactions.quotes', {
              count: entity.quotes,
            })}
          </Text>
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
