import { TouchableOpacity } from '@gorhom/bottom-sheet';
import Icon from 'react-native-vector-icons/Feather';
import { observer } from 'mobx-react';
import React from 'react';
import { View, Text } from 'react-native';
import NavigationService from '../../navigation/NavigationService';
import ThemedStyles from '../../styles/ThemedStyles';
import type CommentsStore from './CommentsStore';
import i18n from '../../common/services/i18n.service';
import { useRoute } from '@react-navigation/native';
import { useBottomSheet } from '@gorhom/bottom-sheet';

export default observer(function CommentListHeader(props: {
  store: CommentsStore;
}) {
  const route = useRoute<any>();

  const theme = ThemedStyles.style;
  const bottomSheet = useBottomSheet();

  const title =
    route.params && route.params.title
      ? route.params.title
      : i18n.t('comments.comments');

  const closeButton = (
    <TouchableOpacity
      style={styles.iconContainer}
      onPress={() => bottomSheet.collapse()}>
      <Icon name={'x'} size={24} style={theme.colorSecondaryText} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.shadow}>
      {props.store.parent ? (
        <View>
          <View style={styles.view}>
            <TouchableOpacity
              onPress={NavigationService.goBack}
              style={theme.paddingHorizontal2x}>
              <Icon
                name={'arrow-left'}
                size={28}
                style={theme.colorSecondaryText}
              />
            </TouchableOpacity>
            {closeButton}
          </View>
        </View>
      ) : (
        <View style={styles.view}>
          <View style={styles.justifyStart}>
            <Text style={titleText}>{title}</Text>
            <Text style={countText}>
              {props.store.entity['comments:count']}
            </Text>
          </View>
          {closeButton}
        </View>
      )}
    </View>
  );
});

const styles = ThemedStyles.create({
  view: ['rowJustifySpaceBetween', 'marginBottom3x', 'alignCenter'],
  justifyStart: ['rowJustifyStart', 'alignCenter'],
  text: ['fontMedium', 'paddingLeft3x'],
  iconContainer: [
    {
      paddingRight: 30,
    },
  ],
  shadow: [
    'borderBottomHair',
    'bcolorPrimaryBorder',
    'bgPrimaryBackground',
    {
      shadowColor: 'black',
      zIndex: 50,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.06,
      shadowRadius: 4,
      elevation: 4,
    },
  ],
});

const titleText = ThemedStyles.combine(styles.text, 'fontXL');
const countText = ThemedStyles.combine(
  styles.text,
  'fontLM',
  'colorSecondaryText',
);
