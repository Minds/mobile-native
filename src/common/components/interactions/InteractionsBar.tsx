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
import InteractionsModal from './InteractionsModal';

interface PropsType {
  entity: ActivityModel | CommentModel | BlogModel;
}
/**
 * Interactions Bar
 */
export default observer(function InteractionsBar({ entity }: PropsType) {
  const modalRef = React.useRef<any>(null);
  const showUpVotes = React.useCallback(() => {
    if (modalRef.current) {
      modalRef.current.show('upVotes');
    }
  }, []);
  const showDownVotes = React.useCallback(() => {
    if (modalRef.current) {
      modalRef.current.show('downVotes');
    }
  }, []);
  const showReminds = React.useCallback(() => {
    if (modalRef.current) {
      modalRef.current.show('reminds');
    }
  }, []);
  const showQuotes = React.useCallback(() => {
    if (modalRef.current) {
      modalRef.current.show('quotes');
    }
  }, []);
  return (
    <View style={containerStyle}>
      <InteractionsModal entity={entity} ref={modalRef} />
      {entity['thumbs:up:count'] > 0 && (
        <PressableScale style={buttonStyle} onPress={showUpVotes}>
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
        <PressableScale style={buttonStyle} onPress={showDownVotes}>
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
        <PressableScale style={buttonStyle} onPress={showReminds}>
          <Text style={textStyle}>
            <Text style={countStyle}>{abbrev(entity.reminds, 0)}</Text>{' '}
            {i18n.t('interactions.reminds', {
              count: entity.reminds,
            })}
          </Text>
        </PressableScale>
      )}
      {entity.quotes > 0 && (
        <PressableScale style={buttonStyle} onPress={showQuotes}>
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
