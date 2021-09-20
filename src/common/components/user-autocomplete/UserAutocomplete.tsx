import React from 'react';
import { observer, useLocalStore } from 'mobx-react';
import { View } from 'react-native';
import ThemedStyles from '../../../styles/ThemedStyles';
import createUserAutocompleteStore from './createUserAutocompleteStore';
import KeyboardAccessory from '../KeyboardAccessory';
import UserTypeahead from '../user-typeahead/UserTypeahead';
import UserList from './UserList';
import { Icon } from 'react-native-elements';

type PropsType = {
  onSelect: Function;
  text: string;
  selection: any;
  addToBottom?: number;
};

const UserAutocomplete = observer(
  ({ onSelect, text, selection, addToBottom }: PropsType) => {
    const store = useLocalStore(createUserAutocompleteStore, { onSelect });

    React.useEffect(() => {
      store.onPropsChanged(text, selection);
    }, [selection, store, text]);

    if (!store.tag) {
      return null;
    }

    return (
      <KeyboardAccessory show={Boolean(store.tag)} addToBottom={addToBottom}>
        <UserTypeahead
          isModalVisible={store.isSearchingTag}
          onSelect={store.searchSelect}
          onClose={store.close}
          value={store.tag}
        />
        <View style={style.searchBar}>
          <UserList store={store} />
          <Icon
            containerStyle={style.searchIcon}
            name="search"
            iconStyle={ThemedStyles.style.colorIcon}
            size={30}
            onPress={store.showSearch}
          />
        </View>
      </KeyboardAccessory>
    );
  },
);

const style = ThemedStyles.create({
  searchIcon: [
    {
      position: 'absolute',
      right: 5,
      top: 5,
    },
  ],
  searchBar: [
    {
      flexDirection: 'row',
      height: 40,
      marginTop: 2,
      marginBottom: 2,
    },
  ],
});

export default UserAutocomplete;
