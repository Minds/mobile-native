import { observer, inject, useLocalStore } from 'mobx-react';
import React, { PureComponent, Fragment, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
  SectionList,
  SectionListData,
} from 'react-native';
import { useDiscoveryV2Store } from '../DiscoveryV2Context';
import ThemedStyles from '../../../styles/ThemedStyles';
import { Icon } from 'react-native-elements';

import BottomOptionPopup from '../../../common/components/BottomOptionPopup';
import MenuItem from '../../../common/components/menus/MenuItem';
import MenuSubtitle from '../../../common/components/menus/MenuSubtitle';
import { TDiscoveryTagsTag } from '../DiscoveryV2Store';

interface Props {
  style?: StyleProp<ViewStyle>;
  show: boolean;
  onCancel: () => void;
  onDone: () => void;
}

/**
 * Discovery Manage Tags
 */
export const DiscoveryTagsManager = observer((props: Props) => {
  const discoveryV2 = useDiscoveryV2Store();
  const store = useLocalStore<{
    other: TDiscoveryTagsTag[];
    selected: TDiscoveryTagsTag[];
    deselected: TDiscoveryTagsTag[];
    setTags: Function;
    selectTag: Function;
    deselectTag: Function;
  }>(() => ({
    other: [],
    selected: [],
    deselected: [],
    setTags(selected, other) {
      this.selected = selected;
      this.other = other;
    },
    selectTag(tag) {
      // Queue for adding
      const selectedIndex = this.selected.findIndex(
        (t) => t.value === tag.value,
      );
      if (selectedIndex < 0) {
        this.selected.push(tag);
      }

      // Remove from deselected
      const deselectedIndex = this.deselected.findIndex(
        (t) => t.value === tag.value,
      );
      this.deselected.splice(deselectedIndex, 1);

      // Remove from other
      const otherIndex = this.other.findIndex((t) => t.value === tag.value);
      this.other.splice(otherIndex, 1);
    },
    deselectTag(tag) {
      // Queue for deleting
      const deselectedIndex = this.deselected.findIndex(
        (t) => t.value === tag.value,
      );
      if (deselectedIndex < 0) {
        this.deselected.push(tag);
      }

      // Remove from selected
      const selectedIndex = this.selected.findIndex(
        (t) => t.value === tag.value,
      );
      this.selected.splice(selectedIndex, 1);
    },
  }));

  useEffect(() => {
    store.setTags(discoveryV2.tags.slice(), discoveryV2.trendingTags.slice());
  }, [props.show]);

  const ItemPartial = ({ item, index }) => {
    const tag = item;

    const selected =
      store.selected.findIndex((t) => t.value === tag.value) > -1;

    return (
      <MenuItem
        item={{
          title: '#' + tag.value,
          onPress: () => {
            if (selected) {
              store.deselectTag(tag);
            } else {
              store.selectTag(tag);
            }
          },
          icon: selected
            ? {
                name: 'ios-remove-circle-outline',
                type: 'ionicon',
              }
            : { name: 'ios-add-circle-outline', type: 'ionicon' },
        }}></MenuItem>
    );
  };

  const SectionHeaderPatrial = (info: { section: SectionListData<any> }) => {
    return (
      <View style={[ThemedStyles.style.backgroundSecondary]}>
        <MenuSubtitle>{info.section.title.toUpperCase()}</MenuSubtitle>
      </View>
    );
  };

  /**
   * Key extractor
   */
  const keyExtractor = (item) => String(item.value);

  const onCancel = () => {
    props.onCancel();
  };

  const onDone = () => {
    discoveryV2.saveTags(store.selected, store.deselected);
    props.onDone();
  };

  /**
   * Render
   */

  return (
    <BottomOptionPopup
      height={500}
      title="Manage Tags"
      show={props.show}
      onCancel={onCancel}
      onDone={onDone}
      content={
        <SectionList
          renderItem={ItemPartial}
          renderSectionHeader={SectionHeaderPatrial}
          sections={[
            {
              title: 'Your tags',
              data: [...store.selected.slice()],
            },
            {
              title: 'Other tags',
              data: [...store.other.slice()],
            },
          ]}
          keyExtractor={keyExtractor}></SectionList>
      }
      doneText="Done"
    />
  );
});

const styles = StyleSheet.create({});

export default DiscoveryTagsManager;
