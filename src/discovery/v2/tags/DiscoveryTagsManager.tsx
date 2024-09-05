import { observer, useLocalStore } from 'mobx-react';
import React, { useEffect, useCallback, forwardRef } from 'react';
import {
  BottomSheetModal,
  BottomSheetButton,
} from '../../../common/components/bottom-sheet';
import {
  View,
  StyleProp,
  ViewStyle,
  SectionListData,
  useWindowDimensions,
} from 'react-native';
import { BottomSheetSectionList } from '@gorhom/bottom-sheet';
import Icon from '@expo/vector-icons/Ionicons';

import { useDiscoveryV2Store } from '../useDiscoveryV2Store';
import ThemedStyles from '../../../styles/ThemedStyles';
import MenuSubtitle from '../../../common/components/menus/MenuSubtitle';
import { TDiscoveryTagsTag } from '../DiscoveryV2Store';
import i18n from '../../../common/services/i18n.service';
import MenuItem from '../../../common/components/menus/MenuItem';
import FloatingInput from '../../../common/components/FloatingInput';
import { Spacer } from '~/common/ui';
import { showNotification } from 'AppMessages';

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
  createTag(): boolean {
    if (this.inputValue.length < 3) {
      if (!this.inputValue) {
        return true;
      }
      showNotification('A tag should have at least 3 characters');
      return false;
    }
    const selectedIndex = this.selected.findIndex(
      t => t.value === this.inputValue,
    );
    if (selectedIndex < 0) {
      this.selected.push({ value: this.inputValue });
    }
    this.inputValue = '';
    return true;
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
      <Spacer top="L">
        <MenuSubtitle>{info.section.title.toUpperCase()}</MenuSubtitle>
      </Spacer>
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
  const { height } = useWindowDimensions();

  useEffect(() => {
    store.setTags(discoveryV2.tags.slice(), discoveryV2.trendingTags.slice());
  }, [discoveryV2.tags, discoveryV2.trendingTags, store]);

  const ItemPartial = ({ item }) => {
    const tag = item;

    const selected = store.selected.findIndex(t => t.value === tag.value) > -1;

    return (
      <MenuItem
        title={`#${tag.value}`}
        onPress={() => {
          if (selected) {
            store.deselectTag(tag);
          } else {
            store.selectTag(tag);
          }
        }}
        icon={selected ? 'remove-circle' : 'add-circle'}
      />
    );
  };

  const inputRef = React.useRef<any>();

  const onDone = useCallback(async () => {
    await discoveryV2.saveTags(store.selected, store.deselected);
    ref?.current?.dismiss();
  }, [discoveryV2, ref, store]);

  const onCreate = useCallback(() => {
    if (store.createTag()) {
      inputRef.current?.hide();
    }
  }, [store]);

  const onAdd = useCallback(() => {
    inputRef.current?.show();
  }, []);

  const listHeight = React.useMemo(
    () => ({ height: (height - 60) * 0.6 }),
    [height],
  );

  const sections = [
    {
      title: i18n.t('discovery.yourTags'),
      data: store.selected.slice(),
    },
    {
      title: i18n.t('discovery.otherTags'),
      data: store.other.slice(),
    },
  ];

  /**
   * Render
   */
  return (
    <>
      <BottomSheetModal title={i18n.t('discovery.manage')} ref={ref}>
        <View style={theme.rowJustifyCenter}>
          <View style={theme.width50}>
            <BottomSheetButton text={i18n.t('add')} onPress={onAdd} action />
          </View>
          <View style={theme.width50}>
            <BottomSheetButton text={i18n.t('save')} onPress={onDone} action />
          </View>
        </View>
        <BottomSheetSectionList
          style={listHeight}
          contentContainerStyle={theme.paddingBottom20x}
          renderItem={ItemPartial}
          renderSectionHeader={SectionHeaderPartial}
          sections={sections}
          keyExtractor={keyExtractor}
          stickySectionHeadersEnabled={true}
        />
      </BottomSheetModal>
      <FloatingInput
        ref={inputRef}
        autoCapitalize="none"
        onSubmitEditing={onCreate}
        value={store.inputValue}
        onChangeText={v => store.setValue(v)}>
        <Icon
          name="add-circle-outline"
          size={22}
          style={theme.colorSecondaryText}
          onPress={onCreate}
        />
      </FloatingInput>
    </>
  );
};

export default observer(forwardRef(DiscoveryTagsManager));
