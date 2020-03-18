import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity as RNTouchableOpacity,
  Platform,
} from 'react-native';
import BottomSheet from 'reanimated-bottom-sheet';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import ThemedStyles from '../styles/ThemedStyles';
import NavigationService from '../navigation/NavigationService';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { observer } from 'mobx-react';
import { useKeyboard } from '@react-native-community/hooks';

const Touchable = Platform.select({
  ios: RNTouchableOpacity,
  android: TouchableOpacity,
});

const height = Platform.select({android: 80, ios: 90});

/**
 * Header
 */
const renderHeader = () => (
  <View
    style={[
      styles.header,
      ThemedStyles.style.backgroundPrimary,
      ThemedStyles.style.borderPrimary,
    ]}>
    <Text
      style={[ThemedStyles.style.fontL, ThemedStyles.style.colorSecondaryText]}>
      POST OPTIONS
    </Text>
    <MIcon
      size={24}
      name="chevron-right"
      style={ThemedStyles.style.colorSecondaryText}
    />
  </View>
);

/**
 * Options
 * @param {Object} props
 */
export default observer(function(props) {
  const tags = props.store.tags;

  const keyboard = useKeyboard();
  const ref = useRef();

  useEffect(() => {
    if (keyboard.keyboardShown) {
      ref.current.snapTo(0);
    }
  }, [keyboard.keyboardShown]);

  const renderInner = () => (
    <View style={ThemedStyles.style.backgroundPrimary}>
      <Touchable
        style={[styles.row, ThemedStyles.style.borderPrimary]}
        onPress={() => {
          NavigationService.navigate('TagSelector', { store: props.store });
        }}>
        <Text
          style={[styles.optionTitle, ThemedStyles.style.colorSecondaryText]}>
          Tag
        </Text>
        <Text style={styles.optionDescription} numberOfLines={1}>
          {tags.slice(0, 4).map(t => `#${t} `)}
        </Text>
        <MIcon
          size={20}
          name="chevron-right"
          style={ThemedStyles.style.colorIcon}
        />
      </Touchable>
      <Touchable style={[styles.row, ThemedStyles.style.borderPrimary]}>
        <Text
          style={[styles.optionTitle, ThemedStyles.style.colorSecondaryText]}>
          NSFW
        </Text>
        <Text style={styles.optionDescription} numberOfLines={1}>
          Safe
        </Text>
        <MIcon
          size={20}
          name="chevron-right"
          style={ThemedStyles.style.colorIcon}
        />
      </Touchable>
      <Touchable style={[styles.row, ThemedStyles.style.borderPrimary]}>
        <Text
          style={[styles.optionTitle, ThemedStyles.style.colorSecondaryText]}>
          Schedule Post
        </Text>
        <Text style={styles.optionDescription} numberOfLines={1}>
          Now
        </Text>
        <MIcon
          size={20}
          name="chevron-right"
          style={ThemedStyles.style.colorIcon}
        />
      </Touchable>
      <Touchable style={[styles.row, ThemedStyles.style.borderPrimary]}>
        <Text
          style={[styles.optionTitle, ThemedStyles.style.colorSecondaryText]}>
          Monetize
        </Text>
        <Text style={styles.optionDescription} numberOfLines={1}>
          none
        </Text>
        <MIcon
          size={20}
          name="chevron-right"
          style={ThemedStyles.style.colorIcon}
        />
      </Touchable>
      <Touchable style={[styles.row, ThemedStyles.style.borderPrimary]}>
        <Text
          style={[styles.optionTitle, ThemedStyles.style.colorSecondaryText]}>
          Visibility
        </Text>
        <Text style={styles.optionDescription} numberOfLines={1}>
          Public
        </Text>
        <MIcon
          size={20}
          name="chevron-right"
          style={ThemedStyles.style.colorIcon}
        />
      </Touchable>
      <Touchable style={[styles.row, ThemedStyles.style.borderPrimary]}>
        <Text
          style={[styles.optionTitle, ThemedStyles.style.colorSecondaryText]}>
          License
        </Text>
        <Text style={styles.optionDescription} numberOfLines={1}>
          Creative commons
        </Text>
        <MIcon
          size={20}
          name="chevron-right"
          style={ThemedStyles.style.colorIcon}
        />
      </Touchable>
      <Touchable style={[styles.row, ThemedStyles.style.borderPrimary]}>
        <Text
          style={[styles.optionTitle, ThemedStyles.style.colorSecondaryText]}>
          Minds TV
        </Text>
        <Text style={styles.optionDescription} numberOfLines={1}>
          No
        </Text>
        <MIcon
          size={20}
          name="chevron-right"
          style={ThemedStyles.style.colorIcon}
        />
      </Touchable>
    </View>
  );

  return (
    <BottomSheet
      ref={ref}
      snapPoints={[height, 450]}
      renderContent={renderInner}
      renderHeader={renderHeader}
      enabledInnerScrolling={true}
      enabledContentTapInteraction={true}
    />
  );
});

const styles = StyleSheet.create({
  header: {
    height,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 10,
    paddingBottom: Platform.select({ ios: 30, android: 20 }),
  },
  optionTitle: {
    width: '40%',
    fontSize: 16,
  },
  optionDescription: {
    flex: 1,
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    height: 50,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
