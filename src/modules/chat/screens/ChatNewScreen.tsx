import { View } from 'react-native';
import React, { useReducer, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import TextInput from '~/common/components/TextInput';
import { B1, Button, Screen, ScreenHeader } from '~/common/ui';
import ThemedStyles from '~/styles/ThemedStyles';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import SearchBarService from '~/topbar/searchbar/SearchBar.service';
import CenteredLoading from '~/common/components/CenteredLoading';
import { ScrollView } from 'react-native';
import ChatUserItem from '../components/ChatUserItem';
import UserModel from '~/channel/UserModel';
import ChatUserChip from '../components/ChatUserChip';
import sessionService from '~/common/services/session.service';
import { useCreateChatRoom } from '../hooks/useCreateChatRoom';

/**
 * Chat room creation screen
 */
export default function ChatNewScreen() {
  return (
    <Screen safe>
      <ScreenHeader back={true} title="New chat" />
      <UserSearchAndSelect />
    </Screen>
  );
}

const UserSearchAndSelect = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, manageSelectedUsers] = useReducer((state, action) => {
    switch (action.type) {
      case 'add':
        return [...state, action.user];
      case 'remove':
        return state.filter(user => user.guid !== action.user.guid);
      default:
        return state;
    }
  }, [] as UserModel[]);

  const searchBy = !!searchTerm && searchTerm.length > 2 ? searchTerm : '';

  const { isLoading, error, data } = useQuery(
    ['search', searchTerm],
    async () => {
      const currentUser = sessionService.getUser();
      const response = await SearchBarService.getSuggestedSearch(searchTerm);
      return response.filter(u => u.guid !== currentUser.guid);
    },
    {
      enabled: !!searchBy, // Disable query if searchTerm is empty
      staleTime: 5000, // Cache results for 5 seconds
      cacheTime: 10000, // Re-fetch after 10 seconds
    },
  );

  return (
    <>
      <View style={styles.searchContainer}>
        <Icon
          name="magnify"
          style={ThemedStyles.style.colorSecondaryText}
          size={22}
        />
        <TextInput
          style={styles.searchInput}
          onChangeText={setSearchTerm}
          placeholder="Search for people"
          placeholderTextColor={ThemedStyles.getColor('TertiaryText')}
        />
      </View>
      <ScrollView>
        <>
          {!searchBy && !selectedUsers.length && (
            <B1 align="center" top="XL" color="secondary">
              Try searching for people to send a chat.
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
          {data &&
            data.map((user, index) => (
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
        <CreateButton selectedUsers={selectedUsers} />
      </View>
    </>
  );
};

const CreateButton = ({ selectedUsers }) => {
  const { createChatRoom, isLoading } = useCreateChatRoom(true);

  const onPress = () => {
    createChatRoom(selectedUsers.map(u => u.guid));
  };

  return (
    <Button
      type="action"
      mode="solid"
      align="stretch"
      loading={isLoading}
      onPress={onPress}
      disabled={selectedUsers.length === 0 || isLoading}>
      Create chat
    </Button>
  );
};

const styles = ThemedStyles.create({
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
