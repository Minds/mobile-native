import React, { useReducer, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';

import { B1 } from '~/common/ui';
import UserModel from '~/channel/UserModel';
import ChatUserChip from './ChatUserChip';
import TextInput from '~/common/components/TextInput';
import ChatUserItem from './ChatUserItem';
import CenteredLoading from '~/common/components/CenteredLoading';
import sp from '~/services/serviceProvider';

export const UserSearchAndSelect = ({
  ActionButton,
  description,
  ignore,
}: {
  ActionButton: React.FC<{ selectedUsers: Array<UserModel> }>;
  description: string;
  ignore?: string[];
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, manageSelectedUsers] = useReducer(
    (
      state: Array<UserModel>,
      action: { type: 'add' | 'remove'; user: UserModel },
    ) => {
      switch (action.type) {
        case 'add':
          return [...state, action.user];
        case 'remove':
          return state.filter(user => user.guid !== action.user.guid);
        default:
          return state;
      }
    },
    [] as UserModel[],
  );

  const searchBy = !!searchTerm && searchTerm.length > 2 ? searchTerm : '';

  const { isLoading, error, data } = useQuery(
    ['search', searchTerm],
    async () => {
      const currentUser = sp.session.getUser();
      const response = await sp
        .resolve('searchBar')
        .getSuggestedSearch(searchTerm);
      return response.filter(u => u.guid !== currentUser.guid);
    },
    {
      enabled: !!searchBy, // Disable query if searchTerm is empty
      staleTime: 5000, // Cache results for 5 seconds
      cacheTime: 10000, // Re-fetch after 10 seconds
    },
  );

  const filteredData = !ignore
    ? data
    : data?.filter(user => !ignore.some(ignored => ignored === user.guid));

  return (
    <>
      <View style={styles.searchContainer}>
        <Icon
          name="magnify"
          style={sp.styles.style.colorSecondaryText}
          size={22}
        />
        <TextInput
          style={styles.searchInput}
          onChangeText={setSearchTerm}
          placeholder="Search for people"
          placeholderTextColor={sp.styles.getColor('TertiaryText')}
        />
      </View>
      <ScrollView>
        <>
          {!searchBy && !selectedUsers.length && (
            <B1 align="center" top="XL" color="secondary">
              {description}
            </B1>
          )}
          {isLoading && !!searchBy && <CenteredLoading />}
          {error && (
            <B1 align="center" top="XL" color="secondary">
              Error searching users
            </B1>
          )}
          {selectedUsers.length > 0 && (
            <View style={styles.chipContainer}>
              {selectedUsers.map((user, key) => (
                <ChatUserChip
                  key={key}
                  user={UserModel.create(user)}
                  onPress={() => {
                    manageSelectedUsers({
                      type: 'remove',
                      user: user,
                    });
                  }}
                />
              ))}
            </View>
          )}
          {filteredData &&
            filteredData.map((user, index) => (
              <ChatUserItem
                key={index}
                selected={selectedUsers.some(su => su.guid === user.guid)}
                user={UserModel.create(user)}
                onPress={() => {
                  const selected = selectedUsers.some(
                    su => su.guid === user.guid,
                  );
                  manageSelectedUsers({
                    type: selected ? 'remove' : 'add',
                    user: user,
                  });
                }}
              />
            ))}
        </>
      </ScrollView>
      <View style={styles.buttonContainer}>
        <ActionButton selectedUsers={selectedUsers} />
      </View>
    </>
  );
};

const styles = sp.styles.create({
  buttonContainer: [
    'paddingHorizontal4x',
    'paddingVertical4x',
    'borderTop',
    'bcolorPrimaryBorder',
  ],
  chipContainer: [
    'rowJustifyStart',
    'marginHorizontal4x',
    'paddingVertical5x',
    'borderBottom',
    'bcolorPrimaryBorder',
    { flexGrow: 1, flexWrap: 'wrap', gap: 12 },
  ],
  searchContainer: [
    'rowJustifyStart',
    'paddingVertical2x',
    'paddingHorizontal3x',
    'marginHorizontal4x',
    'border',
    'bcolorPrimaryBorder',
    'borderRadius4x',
    'bgPrimaryBackground',
  ],
  searchInput: ['fontL', 'colorPrimaryText', 'paddingLeft3x', 'flexContainer'],
});
