import React, { useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { observer, useLocalStore } from 'mobx-react';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import ThemedStyles from '../styles/ThemedStyles';
import TopBar from './TopBar';
import i18n from '../common/services/i18n.service';
import NavigationService from '../navigation/NavigationService';
import hashtagService from '../common/services/hashtag.service';
import HistoryStore from '../common/stores/HistoryStore';
import sessionService from '../common/services/session.service';

/**
 * Tag row
 * @param {Object} props
 */
const TagRow = (props) => {
  const onDelete = useCallback(() => {
    props.store.removeTag(props.tag);
  }, [props.store, props.tag]);

  return (
    <View style={[styles.tagRow, ThemedStyles.style.borderPrimary]}>
      <Text
        style={[ThemedStyles.style.flexContainer, ThemedStyles.style.fontXL]}>
        #{props.tag}
      </Text>
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
  const inputRef = useRef();

  const localStore = useLocalStore(
    ({ postStore }) => ({
      history: new HistoryStore(`${sessionService.guid}-tags-history`, 12),
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
        postStore.addTag(localStore.text);
        localStore.history.add(localStore.text);
        localStore.text = '';
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
    <View style={[theme.flexContainer, theme.backgroundPrimary]}>
      <TopBar
        leftText="Tags"
        rightText={i18n.t('done')}
        onPressRight={NavigationService.goBack}
        onPressBack={NavigationService.goBack}
        store={store}
      />
      <Text
        style={[
          theme.paddingVertical4x,
          theme.colorSecondaryText,
          theme.fontXL,
          theme.paddingHorizontal3x,
        ]}>
        {i18n.t('capture.tagsDescription')}
      </Text>
      <View style={styles.suggestedContainer}>
        <ScrollView
          contentContainerStyle={styles.suggestedScroll}
          horizontal={true}>
          <MIcon name="fire" size={23} style={theme.colorAlert} />
          {localStore.suggested.map((t) => (
            <Text
              style={[styles.tag, theme.colorIconActive]}
              onPress={() => store.addTag(t.value)}>
              #{t.value}
            </Text>
          ))}
        </ScrollView>
      </View>
      <Text
        style={[
          theme.paddingVertical4x,
          theme.colorSecondaryText,
          theme.fontM,
          theme.paddingHorizontal3x,
        ]}>
        Tag
      </Text>
      <TextInput
        ref={inputRef}
        style={[
          theme.colorPrimaryText,
          theme.borderPrimary,
          styles.input,
          localStore.focused ? theme.backgroundSecondary : null,
        ]}
        placeholder="Enter tag"
        placeholderTextColor={ThemedStyles.getColor('tertiary_text')}
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
        <View style={[styles.tagHistory, theme.backgroundSecondary]}>
          <View style={styles.tagHistoryOpt}>
            <Text style={theme.colorSecondaryText}>Recent tags</Text>
            <Text
              style={theme.colorSecondaryText}
              onPress={localStore.history.clear}>
              Clear history
            </Text>
          </View>
          <ScrollView keyboardShouldPersistTaps={'handled'}>
            {localStore.history.history.map((t) => (
              <Text
                style={styles.historyTag}
                onPress={() => localStore.addString(t)}>
                #{t}
              </Text>
            ))}
          </ScrollView>
        </View>
      )}
      <View style={styles.tagsContainer}>
        {store.tags.map((t) => (
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
