import React, { useCallback, useEffect } from 'react';
import { View, Text } from 'react-native';
import ThemedStyles from '../../styles/ThemedStyles';
import { observer, useLocalStore } from 'mobx-react';
import logService from '../services/log.service';
import CenteredLoading from './CenteredLoading';
import apiService from '../services/api.service';
import type { ApiResponse } from '../services/api.service';
import SettingInput from './SettingInput';
import i18n from '../services/i18n.service';
import debounce from '../helpers/debounce';
import Input from './Input';

type addressType = {
  state?: string;
  city?: string;
  town?: string;
};
type locationType = {
  address: addressType;
  lat: number;
  long: number;
};
type onEditFn = (onEdit: boolean) => boolean;
type propsType = {
  value: string;
  onChangeText: Function;
  onEdit?: onEditFn;
  inputStyle?: 'inputAlone' | 'withWraper';
};

interface GeolocationResponse extends ApiResponse {
  results: Array<locationType>;
}

const createLocationAutoSuggestStore = () => {
  const locations: Array<locationType> = [];
  const store = {
    isFocused: false,
    loading: false,
    tapped: false,
    error: false,
    value: '',
    locations: locations,
    onEdit: undefined as onEditFn | undefined,
    initialLoad(value: string, onEdit?: onEditFn) {
      this.value = value;
      this.onEdit = onEdit;
      this.isFocused = true;
    },
    setValue(value: string, doQuery = true) {
      this.value = value;
      this.setTapped(false);
      this.setError(false);
      if (doQuery && this.value.length >= 3) {
        this.setLoading(true);
        if (this.onEdit) {
          this.onEdit(true);
        }
        this.query();
      }
    },
    setTapped(tapped: boolean) {
      this.tapped = tapped;
    },
    setLoading(loading: boolean) {
      this.loading = loading;
    },
    setError(error: boolean) {
      this.error = error;
    },
    setLocations(locationsReponse: Array<locationType>) {
      this.locations = locationsReponse;
    },
    shouldShowList(): boolean {
      return this.value.length >= 3 && !this.tapped;
    },
    query() {
      const me = this;
      debounce(async () => {
        try {
          const response: GeolocationResponse = await apiService.get(
            'api/v1/geolocation/list',
            {
              q: me.value,
            },
          );
          if (response.status === 'success') {
            me.setLocations(response.results);
          } else {
            const error = new Error('geolocation failed');
            throw error;
          }
        } catch (err) {
          logService.exception('[location autoSuggest]', err);
          me.setError(true);
        } finally {
          me.setLoading(false);
        }
      }, 400)();
    },
    onBlur() {
      this.isFocused = false;
    },
  };
  return store;
};

const LocationAutoSuggest = observer((props: propsType) => {
  const store = useLocalStore(createLocationAutoSuggestStore);
  const theme = ThemedStyles.style;

  const setLocation = useCallback(
    (value) => {
      store.setValue(value, false);
      store.setTapped(true);
      props.onChangeText(value);
      if (props.onEdit) {
        props.onEdit(false);
      }
    },
    [store, props],
  );

  useEffect(() => {
    if (!store.isFocused) {
      store.initialLoad(props.value, props.onEdit);
    }
  }, [store, props]);

  const listStyle = [theme.backgroundTertiary, theme.flexContainer];

  const TextInput = props?.inputStyle === 'inputAlone' ? Input : SettingInput;

  return (
    <View>
      <TextInput
        placeholder={i18n.t('channel.edit.location')}
        onChangeText={store.setValue}
        value={store.value}
        testID="cityInput"
        onFocus={() => store.setValue('')}
        onBlur={store.onBlur}
        wrapperBorder={theme.borderTop}
      />
      {store.shouldShowList() && (
        <View style={listStyle}>
          {store.loading ? (
            <CenteredLoading />
          ) : (
            store.locations.map((value: locationType) => {
              if (!(value.address.town || value.address.city)) {
                return null;
              }
              return (
                <Text
                  onPress={() =>
                    setLocation(value.address.city ?? value.address.state)
                  }
                  style={[
                    theme.paddingLeft5x,
                    theme.paddingVertical2x,
                    theme.colorSecondaryText,
                    theme.fontL,
                  ]}>
                  {`${value.address.town ?? ''}${value.address.city ?? ''}, ${
                    value.address.state ?? ''
                  }`}
                </Text>
              );
            })
          )}
        </View>
      )}
    </View>
  );
});

export default LocationAutoSuggest;
