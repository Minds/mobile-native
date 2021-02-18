import { observer, useLocalStore } from 'mobx-react';
import React, { useEffect, useCallback } from 'react';
import {
  View,
  StyleProp,
  ViewStyle,
  SectionList,
  SectionListData,
  Platform,
} from 'react-native';
import { useDiscoveryV2Store } from '../useDiscoveryV2Store';
import ThemedStyles from '../../../styles/ThemedStyles';

import BottomOptionPopup from '../../../common/components/BottomOptionPopup';
import MenuItem from '../../../common/components/menus/MenuItem';
import MenuSubtitle from '../../../common/components/menus/MenuSubtitle';
import { TDiscoveryTagsTag } from '../DiscoveryV2Store';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import InputContainer from '../../../common/components/InputContainer';
import i18n from '../../../common/services/i18n.service';
import { useDimensions } from '@react-native-community/hooks';

interface Props {
  style?: StyleProp<ViewStyle>;
  show: boolean;
  onCancel: () => void;
  onDone: () => void;
}

/**
 * Key extractor
 */
const keyExtractor = (item) => String(item.value);

const createStore = () => ({
  other: [] as TDiscoveryTagsTag[],
  selected: [] as TDiscoveryTagsTag[],
  deselected: [] as TDiscoveryTagsTag[],
  inputValue: '',
  setValue(v: string) {
    this.inputValue = v;
  },
  createTag() {
    const selectedIndex = this.selected.findIndex(
      (t) => t.value === this.inputValue,
    );
    if (selectedIndex < 0) {
      this.selected.push({ value: this.inputValue });
    }
    this.inputValue = '';
  },
  setTags(selected, other) {
    this.selected = selected;
    this.other = other;
  },
  selectTag(tag) {
    // Queue for adding
    const selectedIndex = this.selected.findIndex((t) => t.value === tag.value);
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
    const selectedIndex = this.selected.findIndex((t) => t.value === tag.value);
    this.selected.splice(selectedIndex, 1);
  },
});

type StoreType = ReturnType<typeof createStore>;

/**
 * Discovery Manage Tags
 */
export const DiscoveryTagsManager = observer((props: Props) => {
  const theme = ThemedStyles.style;
  const discoveryV2 = useDiscoveryV2Store();
  const store = useLocalStore<StoreType>(createStore);
  const { height } = useDimensions().window;

  useEffect(() => {
    store.setTags(discoveryV2.tags.slice(), discoveryV2.trendingTags.slice());
  }, [discoveryV2.tags, discoveryV2.trendingTags, props.show, store]);

  const ItemPartial = ({ item }) => {
    const tag = item;

    const selected =
      store.selected.findIndex((t) => t.value === tag.value) > -1;

    return (
      <MenuItem
        component={Platform.OS === 'android' ? TouchableOpacity : undefined}
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
        }}
      />
    );
  };

  const SectionHeaderPatrial = (info: { section: SectionListData<any> }) => {
    return (
      <View style={[theme.backgroundSecondary]}>
        <MenuSubtitle>{info.section.title.toUpperCase()}</MenuSubtitle>
      </View>
    );
  };

  const onCancel = useCallback(() => {
    props.onCancel();
  }, [props]);

  const onDone = useCallback(() => {
    discoveryV2.saveTags(store.selected, store.deselected);
    props.onDone();
  }, [discoveryV2, store, props]);

  const onCreate = useCallback(() => {
    store.createTag();
    discoveryV2.saveTags(store.selected, store.deselected);
  }, [store, discoveryV2]);

  /**
   * Render
   */
  return (
    <BottomOptionPopup
      noOverlay
      height={(height - 100) * 0.9}
      title={i18n.t('discovery.manage')}
      show={props.show}
      onCancel={onCancel}
      onDone={onDone}
      content={
        <ScrollView>
          <SectionList
            ListHeaderComponent={
              <InputContainer
                placeholder={i18n.t('add')}
                onChangeText={store.setValue}
                onSubmitEditing={onCreate}
                value={store.inputValue}
                style={[
                  theme.backgroundPrimary,
                  theme.marginRight4x,
                  theme.paddingLeft2x,
                ]}
                testID="hashtagInput"
                selectTextOnFocus={true}
              />
            }
            renderItem={ItemPartial}
            renderSectionHeader={SectionHeaderPatrial}
            sections={[
              {
                title: i18n.t('discovery.yourTags'),
                data: store.selected.slice(),
              },
              {
                title: i18n.t('discovery.otherTags'),
                data: store.other.slice(),
              },
            ]}
            keyExtractor={keyExtractor}
            stickySectionHeadersEnabled={true}
          />
        </ScrollView>
      }
      doneText={i18n.t('done')}
    />
  );
});

export default DiscoveryTagsManager;
