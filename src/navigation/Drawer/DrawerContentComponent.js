import React from 'react';
import {observer, inject} from 'mobx-react/native';
import {ScrollView} from 'react-navigation';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import {Text} from 'react-native-elements';

import {MINDS_CDN_URI} from '../../config/Config';

import {SafeAreaView} from 'react-navigation';

import withPreventDoubleTap from '../../common/components/PreventDoubleTap';
import abbrev from '../../common/helpers/abbrev';
import FastImage from 'react-native-fast-image';
import i18n from '../../common/services/i18n.service';
import CustomDrawerItems from './CustomDrawerItems';

const DebouncedTouchableOpacity = withPreventDoubleTap(TouchableOpacity);

/**
 * Navigate To channel
 */
const navToChannel = props => {
  // only active if receive the navigation property
  if (props.navigation) {
    props.navigation.push('Channel', {guid: props.user.me.guid});
  }
};

const getAvatar = props => {
  const src = {
    uri: `${MINDS_CDN_URI}icon/${props.user.me.guid}/medium/${
      props.user.me.icontime
    }`,
  };
  return (
    <View style={styles.avatarContainer}>
      <DebouncedTouchableOpacity onPress={() => navToChannel(props)}>
        <FastImage source={src} style={styles.avatar}/>
      </DebouncedTouchableOpacity>
      <View style={styles.body}>
        <View style={styles.nameContainer}>
          <DebouncedTouchableOpacity onPress={() => navToChannel(props)}>
            <Text style={styles.username}>{props.user.me.name}</Text>
            <Text style={styles.userInfo}>
              {`${abbrev(props.user.me.subscribers_count, 0)} ${i18n
                .t('subscribers')
                .toLowerCase()}`}
            </Text>
          </DebouncedTouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export const DrawerContentComponent = inject('user')(
  observer(props => {
    return (
      <ScrollView>
        <SafeAreaView
          style={styles.container}
          forceInset={{top: 'always', horizontal: 'never'}}>
          <View>{getAvatar(props)}</View>
          <CustomDrawerItems {...props} />
        </SafeAreaView>
      </ScrollView>
    );
  }),
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  avatarContainer: {
    display: 'flex',
    padding: 8,
    alignItems: 'center',
    flexDirection: 'row',
  },
  avatar: {
    height: 46,
    width: 46,
    borderRadius: 23,
    borderWidth: 0.5,
    borderColor: '#EEE',
  },
  body: {
    marginLeft: 8,
    paddingRight: 36,
    flexWrap: 'wrap',
    flex: 1,
  },
  nameContainer: {
    flexDirection: 'row',
  },
  username: {
    fontWeight: 'bold',
    fontFamily: 'Roboto',
    color: '#4A4A4A',
    fontSize: 16,
  },
  userInfo: {
    fontFamily: 'Roboto',
    color: '#9B9B9B',
    fontSize: 14,
  },
});
