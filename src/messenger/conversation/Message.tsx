import React, { useCallback } from 'react';

import { observer } from 'mobx-react';

import { Text, View, Image, StyleSheet, TouchableOpacity } from 'react-native';

import formatDate from '../../common/helpers/date';
import Tags from '../../common/components/Tags';
import ThemedStyles from '../../styles/ThemedStyles';
import type MessageModel from './MessageModel';

type PropsType = {
  message: MessageModel;
  right?: boolean;
  navigation: any;
};

/**
 * Message
 */
export default observer(function (props: PropsType) {
  const theme = ThemedStyles.style;

  /**
   * Navigate To channel
   */
  const navToChannel = useCallback(() => {
    // only active if receive the navigation property
    if (props.navigation && props.message.owner) {
      props.navigation.push('Channel', {
        guid: props.message.owner.guid,
      });
    }
  }, [props.navigation, props.message]);

  if (props.right) {
    return (
      <View>
        <View
          style={[
            styles.messageContainer,
            styles.right,
            props.message.sending ? styles.sending : null,
          ]}>
          <View
            style={[
              theme.rowJustifyCenter,
              styles.textContainer,
              theme.backgroundLink,
            ]}>
            <Text
              selectable={true}
              style={[styles.message, theme.colorWhite]}
              onLongPress={props.message.toggleShowDate}>
              <Tags
                color="#FFF"
                style={theme.colorWhite}
                navigation={props.navigation}>
                {props.message.decryptedMessage}
              </Tags>
            </Text>
          </View>
          <TouchableOpacity onPress={navToChannel}>
            <Image
              source={props.message.avatarSource}
              style={[styles.avatar, styles.smallavatar]}
            />
          </TouchableOpacity>
        </View>
        {props.message.showDate ? (
          <Text
            selectable={true}
            style={[styles.messagedate, styles.rightText]}>
            {formatDate(props.message.time_created)}
          </Text>
        ) : null}
      </View>
    );
  }

  return (
    <View>
      <View
        style={[
          styles.messageContainer,
          props.message.sending ? styles.sending : null,
        ]}>
        <TouchableOpacity onPress={navToChannel}>
          <Image
            source={props.message.avatarSource}
            style={[styles.avatar, styles.smallavatar]}
          />
        </TouchableOpacity>
        <View
          style={[
            theme.rowJustifyCenter,
            styles.textContainer,
            theme.backgroundTertiary,
          ]}>
          <Text
            selectable={true}
            style={[styles.message]}
            onLongPress={props.message.toggleShowDate}>
            <Tags style={styles.message} navigation={props.navigation}>
              {props.message.decryptedMessage}
            </Tags>
          </Text>
        </View>
      </View>
      {props.message.showDate ? (
        <Text selectable={true} style={styles.messagedate}>
          {formatDate(props.message.time_created)}
        </Text>
      ) : null}
    </View>
  );
});

// styles
const styles = StyleSheet.create({
  smallavatar: {
    height: 30,
    width: 30,
    borderRadius: 15,
  },
  sending: {
    opacity: 0.5,
  },
  avatar: {
    height: 36,
    width: 36,
    borderRadius: 18,
  },
  textContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#EEE',
    borderRadius: 15,
    padding: 12,
    marginLeft: 8,
    marginRight: 8,
  },
  messageContainer: {
    margin: 4,
    marginTop: 8,
    marginBottom: 8,
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flex: 1,
  },
  right: {
    justifyContent: 'flex-end',
  },
  rightText: {
    textAlign: 'right',
  },
  message: {
    maxWidth: 272,
  },
  messagedate: {
    fontSize: 9,
    marginTop: 2,
    marginLeft: 38,
    marginRight: 38,
  },
});
