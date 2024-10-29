import React, { useCallback, useEffect } from 'react';
import { View } from 'react-native';

import { observer, useLocalStore } from 'mobx-react';
import CenteredLoading from './CenteredLoading';
import type { ApiResponse } from '../services/ApiResponse';
import debounce from '../helpers/debounce';
import Input from './Input';
import MText from './MText';
import InputContainer from './InputContainer';
import sp from '~/services/serviceProvider';

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
type PropsType = {
  placeholder?: string;
  info?: string;
  editable?: boolean;
  optional?: boolean;
  value: string;
  onChangeText: Function;
  onFocus?: () => void;
  onEdit?: onEditFn;
  inputStyle?: 'inputAlone' | 'withWraper';
  wrapperBorder: any;
};

interface GeolocationResponse extends ApiResponse {
  results: Array<locationType>;
}

const createLocationAutoSuggestStore = (p: PropsType) => {
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
      p.onChangeText(value);
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
          const response: GeolocationResponse = await sp.api.get(
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
          sp.log.exception('[location autoSuggest]', err);
          me.setError(true);
        } finally {
          me.setLoading(false);
        }
      }, 400)();
    },
    onBlur() {
      this.onEdit?.(false);
      this.isFocused = false;
    },
  };
  return store;
};

const LocationAutoSuggest = observer((props: PropsType) => {
  const store = useLocalStore(createLocationAutoSuggestStore, props);
  const theme = sp.styles.style;

  const setLocation = useCallback(
    value => {
      store.setValue(value, false);
      store.setTapped(true);
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

  const listStyle = [theme.bgTertiaryBackground, theme.flexContainer];

  const TextInput = props?.inputStyle === 'inputAlone' ? Input : InputContainer;

  return (
    <View>
      <TextInput
        placeholder={sp.i18n.t('channel.edit.location')}
        onChangeText={store.setValue}
        value={store.value}
        testID="cityInput"
        onFocus={props.onFocus}
        onBlur={store.onBlur}
      />
      {store.shouldShowList() && (
        <View style={listStyle}>
          {store.loading ? (
            <CenteredLoading />
          ) : (
            store.locations.map((value: locationType, index: number) => {
              if (!(value.address.town || value.address.city)) {
                return null;
              }
              return (
                <MText
                  key={index}
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
                </MText>
              );
            })
          )}
        </View>
      )}
    </View>
  );
});

export default LocationAutoSuggest;
