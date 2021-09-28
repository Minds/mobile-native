import React, { useEffect, useCallback, useRef } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { observer, useLocalStore } from 'mobx-react';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import ThemedStyles from '../styles/ThemedStyles';
import TopBar from './TopBar';
import i18n from '../common/services/i18n.service';
import NavigationService from '../navigation/NavigationService';
import hashtagService from '../common/services/hashtag.service';
import HistoryStore from '../common/stores/HistoryStore';
import TextInput from '../common/components/TextInput';
import MText from '../common/components/MText';

/**
 * Tag row
 * @param {Object} props
 */
const TagRow = props => {
  const onDelete = useCallback(() => {
    props.store.removeTag(props.tag);
  }, [props.store, props.tag]);

  return (
    <View style={[styles.tagRow, ThemedStyles.style.bcolorPrimaryBorder]}>
      <MText
        style={[ThemedStyles.style.flexContainer, ThemedStyles.style.fontXL]}>
        #{props.tag}
      </MText>
      <TouchableOpacity onPress={onDelete}>
        <MIcon
          name="close"
          size={23}
          style={ThemedStyles.style.colorPrimaryText}
        />
      </TouchableOpacity>
    </View>
  );
};

/**
 * Tag selector
 */
export default observer(function (props) {
  const theme = ThemedStyles.style;
  const store = props.route.params.store;
  const inputRef = useRef(null);

  const localStore = useLocalStore(
    ({ postStore }) => ({
      history: new HistoryStore(`tags-history`, 12),
      text: '',
      suggested: [],
      focused: false,
      setText(t) {
        if (t) {
          t = t.replace(' ', '');
        }
        localStore.text = t;
      },
      setFocused() {
        localStore.focused = true;
      },
      setBlured() {
        localStore.focused = false;
      },
      async loadSuggested() {
        const tags = await hashtagService.getSuggested();
        this.setSuggested(tags);
      },
      setSuggested(s) {
        this.suggested = s;
      },
      add() {
        if (postStore.addTag(localStore.text)) {
          localStore.history.add(localStore.text);
          localStore.text = '';
        }
      },
      addString(tag) {
        postStore.addTag(tag);
        inputRef.current.blur();
      },
    }),
    { postStore: store },
  );

  const showHistory =
    localStore.focused && localStore.history.history.length > 0;

  /**
   * Side effect
   */
  useEffect(() => {
    localStore.loadSuggested();
  }, [localStore]);

  return (
    <View style={[theme.flexContainer, theme.bgPrimaryBackground]}>
      <TopBar
        leftText="Tags"
        rightText={i18n.t('done')}
        onPressRight={NavigationService.goBack}
        onPressBack={NavigationService.goBack}
        store={store}
      />
      <MText
        style={[
          theme.paddingVertical4x,
          theme.colorSecondaryText,
          theme.fontXL,
          theme.paddingHorizontal3x,
        ]}>
        {i18n.t('capture.tagsDescription')}
      </MText>
      <View style={styles.suggestedContainer}>
        <ScrollView
          contentContainerStyle={styles.suggestedScroll}
          horizontal={true}>
          <MIcon name="fire" size={23} style={theme.colorAlert} />
          {localStore.suggested.map(t => (
            <MText
              style={[styles.tag, theme.colorIconActive]}
              onPress={() => store.addTag(t.value)}>
              #{t.value}
            </MText>
          ))}
        </ScrollView>
      </View>
      <MText
        style={[
          theme.paddingVertical4x,
          theme.colorSecondaryText,
          theme.fontM,
          theme.paddingHorizontal3x,
        ]}>
        Tag
      </MText>
      <TextInput
        ref={inputRef}
        style={[
          theme.colorPrimaryText,
          theme.bcolorPrimaryBorder,
          styles.input,
          localStore.focused ? theme.bgSecondaryBackground : null,
        ]}
        placeholder="Enter tag"
        placeholderTextColor={ThemedStyles.getColor('TertiaryText')}
        onSubmitEditing={localStore.add}
        onChangeText={localStore.setText}
        textAlignVertical="top"
        value={localStore.text}
        onFocus={localStore.setFocused}
        autoCapitalize="none"
        onBlur={localStore.setBlured}
        multiline={false}
        autoCorrect={false}
        selectTextOnFocus={true}
        underlineColorAndroid="transparent"
        testID="PostInput"
      />
      {showHistory && (
        <View style={[styles.tagHistory, theme.bgSecondaryBackground]}>
          <View style={styles.tagHistoryOpt}>
            <MText style={theme.colorSecondaryText}>Recent tags</MText>
            <MText
              style={theme.colorSecondaryText}
              onPress={localStore.history.clear}>
              Clear history
            </MText>
          </View>
          <ScrollView keyboardShouldPersistTaps={'handled'}>
            {localStore.history.history.map(t => (
              <MText
                style={styles.historyTag}
                onPress={() => localStore.addString(t)}>
                #{t}
              </MText>
            ))}
          </ScrollView>
        </View>
      )}
      <View style={styles.tagsContainer}>
        {store.tags.map(t => (
          <TagRow tag={t} store={store} />
        ))}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  suggestedContainer: {
    height: 50,
  },
  historyTag: {
    fontSize: 17,
    paddingVertical: 10,
  },
  tagHistoryOpt: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  tagHistory: {
    padding: 10,
    paddingHorizontal: 15,
    marginHorizontal: 15,
    height: 170,
    overflow: 'scroll',
  },
  tagsContainer: {
    marginTop: 20,
  },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 3,
    marginHorizontal: 15,
    paddingHorizontal: 10,
    paddingTop: 13,
    paddingBottom: 13,
    textAlignVertical: 'center',
    fontSize: 17,
    height: 46,
  },
  suggestedScroll: {
    height: 50,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  tag: {
    padding: 10,
    fontSize: 18,
  },
});
