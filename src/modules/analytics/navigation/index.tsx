import React from 'react';
import { LinkingOptions, NavigationContainer } from '@react-navigation/native';

export default function Navigation() {
  return (
    <NavigationContainer linking={LinkingConfiguration}>
      <></>
    </NavigationContainer>
  );
}

// eslint-disable-next-line no-undef
const LinkingConfiguration: LinkingOptions<ReactNavigation.RootParamList> = {
  prefixes: ['https://minds.com'],
  config: {
    screens: {},
  },
};
