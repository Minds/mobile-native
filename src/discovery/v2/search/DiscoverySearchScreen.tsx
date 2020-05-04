import React, { Component, Fragment, ComponentType, useEffect } from 'react';

import { StyleSheet, View } from 'react-native';

import { observer } from 'mobx-react';

import _ from 'lodash';

import SearchView from '../../../common/components/SearchView';
import { CommonStyle as CS } from '../../../styles/Common';

import testID from '../../../common/helpers/testID';
import i18n from '../../../common/services/i18n.service';

import ThemedStyles from '../../../styles/ThemedStyles';
import { useNavigation } from '@react-navigation/core';
import { RouteProp } from '@react-navigation/native';
import { AppStackParamList } from 'src/navigation/NavigationTypes';
import { StackNavigationProp } from '@react-navigation/stack';
import { useStores } from '../../../common/hooks/use-stores';
import { Icon } from 'react-native-elements';
import isIphoneX from '../../../common/helpers/isIphoneX';
import { DiscoverySearchList } from './DiscoverySearchList';

interface Props {
  route: RouteProp<AppStackParamList, 'DiscoverySearch'>;
}

export const DiscoverySearchHeader = observer(() => {
  const { discoveryV2Search } = useStores();

  const navigation = useNavigation<
    StackNavigationProp<AppStackParamList, 'DiscoverySearch'>
  >();

  return (
    <View
      style={[
        CS.shadow,
        ThemedStyles.style.backgroundSecondary,
        {
          paddingTop: isIphoneX ? 50 : 0,
          flexDirection: 'row',
          alignItems: 'center',
        },
      ]}>
      <View style={{ paddingHorizontal: 5 }}>
        <Icon
          color={ThemedStyles.getColor('icon')}
          size={32}
          name="chevron-left"
          type="material-community"
          onPress={() => navigation.goBack()}
        />
      </View>

      <SearchView
        placeholder={i18n.t('discovery.search')}
        onChangeText={discoveryV2Search.setQuery}
        value={discoveryV2Search.query}
        containerStyle={[
          CS.marginTop,
          CS.marginBottom,
          ThemedStyles.style.backgroundPrimary,
          { flex: 1 },
        ]}
        // iconRight={iconRight}
        // iconRightOnPress={this.clearSearch}
        {...testID('Discovery Search Input')}
      />
    </View>
  );
});

/**
 * Discovery screen
 */
export const DiscoverySearchScreen = observer((props: Props) => {
  const { discoveryV2Search } = useStores();

  const navigation = useNavigation<
    StackNavigationProp<AppStackParamList, 'DiscoverySearch'>
  >();
  navigation.setOptions({
    headerShown: false,
  });

  useEffect(() => {
    // const unsubscribe = navigation.addListener('transitionEnd', (s) => {
    discoveryV2Search.setQuery(props.route.params.query);
    // });
    // return unsubscribe;
  }, [props.route.params.query]);

  useEffect(() => {
    // clear data on leave
    const unsubscribe = navigation.addListener('blur', (s) => {
      discoveryV2Search.reset();
    });

    return unsubscribe;
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <DiscoverySearchHeader></DiscoverySearchHeader>
      <DiscoverySearchList
        navigation={navigation}
        style={styles.list}></DiscoverySearchList>
    </View>
  );
});

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
});
