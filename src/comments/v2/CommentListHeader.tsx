import { TouchableOpacity } from '@gorhom/bottom-sheet';
import Icon from '@expo/vector-icons/Feather';
import { observer } from 'mobx-react';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import ThemedStyles from '../../styles/ThemedStyles';
import type CommentsStore from './CommentsStore';
import i18n from '../../common/services/i18n.service';
import { useRoute } from '@react-navigation/native';
import { useBottomSheet } from '@gorhom/bottom-sheet';
import MText from '../../common/components/MText';

export default observer(function CommentListHeader(props: {
  store: CommentsStore;
  navigation: any;
}) {
  const route = useRoute<any>();

  const theme = ThemedStyles.style;
  const bottomSheet = useBottomSheet();

  const { title = i18n.t('comments.comments') } = route.params ?? {};

  const titleStyles = [theme.fontMedium, theme.paddingLeft3x];

  const closeButton = (
    <TouchableOpacity
      style={styles.iconContainer}
      onPress={() => bottomSheet.close()}>
      <Icon name={'x'} size={24} style={theme.colorSecondaryText} />
    </TouchableOpacity>
  );

  return (
    <View
      style={[
        theme.borderBottomHair,
        theme.bcolorPrimaryBorder,
        theme.bgPrimaryBackground,
        styles.shadow,
      ]}>
      {props.store.parent ? (
        <View>
          <View
            style={[
              theme.rowJustifySpaceBetween,
              theme.alignCenter,
              theme.marginBottom3x,
            ]}>
            <TouchableOpacity
              onPress={props.navigation.goBack}
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
        <View
          style={[
            theme.rowJustifySpaceBetween,
            theme.marginBottom3x,
            theme.alignCenter,
          ]}>
          <View style={[theme.rowJustifyStart, theme.alignCenter]}>
            <MText style={[theme.fontXL, ...titleStyles]}>{title}</MText>
            <MText
              style={[theme.fontLM, theme.colorSecondaryText, ...titleStyles]}>
              {props.store.entity['comments:count'] || ''}
            </MText>
          </View>
          {closeButton}
        </View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  iconContainer: {
    paddingRight: 30,
  },
  shadow: {
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
});
