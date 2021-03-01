import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import ThemedStyles from '../../../styles/ThemedStyles';
import featuresService from '../../services/features.service';
import i18n from '../../services/i18n.service';
import FeedStore from '../../stores/FeedStore';

const TIME = 10000;

export default function useLoadNewPosts<T>(feedStore: FeedStore, listRef: any) {
  const [isVisible, setVisible] = useState(false);
  const theme = ThemedStyles.style;
  useEffect(() => {
    let hide;
    let show;
    if (featuresService.has('new-posts')) {
      show = setInterval(async () => {
        const newPosts = await feedStore.checkNewPosts();
        if (newPosts) {
          setVisible(true);
          hide = setTimeout(() => setVisible(false), 2000);
        }
      }, TIME);
    }
    return () => {
      if (show) {
        clearInterval(show);
      }
      if (hide) {
        clearTimeout(hide);
      }
    };
  });

  if (!isVisible) {
    return null;
  }

  const onPress = () => {
    setVisible(false);
    if (listRef) {
      listRef.current?.scrollToOffset({ animated: true, offset: 0 });
    }
    feedStore.refresh();
  };

  return (
    isVisible && (
      <TouchableOpacity
        style={[styles.container, theme.backgroundLink, theme.centered]}
        onPress={onPress}>
        <Icon
          type={'material-community'}
          name="refresh"
          size={18}
          color={'white'}
        />
        <Text style={[theme.fontM, theme.marginLeft2x]}>
          {i18n.t('newsfeed.newPosts')}
        </Text>
      </TouchableOpacity>
    )
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    position: 'absolute',
    zIndex: 1,
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 15,
    marginTop: 10,
  },
});
