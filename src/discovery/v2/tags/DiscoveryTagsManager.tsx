import { observer, useLocalStore } from 'mobx-react';
import React, { useEffect, useCallback, forwardRef } from 'react';
import {
  BottomSheet,
  BottomSheetButton,
} from '../../../common/components/bottom-sheet';
import {
  View,
  StyleProp,
  ViewStyle,
  SectionList,
  SectionListData,
} from 'react-native';
import { TouchableOpacity } from '@gorhom/bottom-sheet';
import Icon from 'react-native-vector-icons/Ionicons';

import { useDiscoveryV2Store } from '../useDiscoveryV2Store';
import ThemedStyles from '../../../styles/ThemedStyles';
import MenuSubtitle from '../../../common/components/menus/MenuSubtitle';
import { TDiscoveryTagsTag } from '../DiscoveryV2Store';
import i18n from '../../../common/services/i18n.service';
import { useDimensions } from '@react-native-community/hooks';
import MenuItem from '../../../common/components/menus/MenuItem';
import FloatingInput from '../../../common/components/FloatingInput';

interface Props {
  style?: StyleProp<ViewStyle>;
}

/**
 * Key extractor
 */
const keyExtractor = item => String(item.value);

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
      t => t.value === this.inputValue,
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
    const selectedIndex = this.selected.findIndex(t => t.value === tag.value);
    if (selectedIndex < 0) {
      this.selected.push(tag);
    }

    // Remove from deselected
    const deselectedIndex = this.deselected.findIndex(
      t => t.value === tag.value,
    );
    this.deselected.splice(deselectedIndex, 1);

    // Remove from other
    const otherIndex = this.other.findIndex(t => t.value === tag.value);
    this.other.splice(otherIndex, 1);
  },
  deselectTag(tag) {
    // Queue for deleting
    const deselectedIndex = this.deselected.findIndex(
      t => t.value === tag.value,
    );
    if (deselectedIndex < 0) {
      this.deselected.push(tag);
    }

    // Remove from selected
    const selectedIndex = this.selected.findIndex(t => t.value === tag.value);
    this.selected.splice(selectedIndex, 1);
  },
});

type StoreType = ReturnType<typeof createStore>;

/**
 * Section header
 */
const SectionHeaderPartial = (info: { section: SectionListData<any> }) => {
  return (
    <View style={ThemedStyles.style.bgPrimaryBackgroundHighlight}>
      <MenuSubtitle>{info.section.title.toUpperCase()}</MenuSubtitle>
    </View>
  );
};

/**
 * Discovery Manage Tags
 */
const DiscoveryTagsManager = (props: Props, ref) => {
  const theme = ThemedStyles.style;
  const discoveryV2 = useDiscoveryV2Store();
  const store = useLocalStore<StoreType>(createStore);
  const { height } = useDimensions().window;

  useEffect(() => {
    store.setTags(discoveryV2.tags.slice(), discoveryV2.trendingTags.slice());
  }, [discoveryV2.tags, discoveryV2.trendingTags, store]);

  const ItemPartial = ({ item }) => {
    const tag = item;

    const selected = store.selected.findIndex(t => t.value === tag.value) > -1;

    return (
      <MenuItem
        component={TouchableOpacity}
        containerItemStyle={ThemedStyles.style.bgPrimaryBackgroundHighlight}
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

  const inputRef = React.useRef<any>();

  const onDone = useCallback(() => {
    discoveryV2.saveTags(store.selected, store.deselected);
  }, [discoveryV2, store]);

  const onCreate = useCallback(() => {
    store.createTag();
    inputRef.current?.hide();
  }, [store]);

  const onAdd = useCallback(() => {
    inputRef.current?.show();
  }, []);

  const listHeight = React.useMemo(
    () => ({ height: (height - 60) * 0.6 }),
    [height],
  );

  /**
   * Render
   */
  return (
    <BottomSheet title={i18n.t('discovery.manage')} ref={ref}>
      <View style={theme.rowJustifyCenter}>
        <View style={theme.width50}>
          <BottomSheetButton text={i18n.t('add')} onPress={onAdd} action />
        </View>
        <View style={theme.width50}>
          <BottomSheetButton text={i18n.t('save')} onPress={onDone} action />
        </View>
      </View>
      <SectionList
        style={listHeight}
        contentContainerStyle={theme.paddingBottom20x}
        renderItem={ItemPartial}
        renderSectionHeader={SectionHeaderPartial}
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
      <FloatingInput
        ref={inputRef}
        onSubmit={onCreate}
        autoCapitalize="none"
        onSubmitEditing={onCreate}
        value={store.inputValue}
        onChangeText={v => store.setValue(v)}>
        <Icon
          name="add-circle-outline"
          size={22}
          style={theme.colorSecondaryText}
        />
      </FloatingInput>
    </BottomSheet>
  );
};

export default observer(forwardRef(DiscoveryTagsManager));
