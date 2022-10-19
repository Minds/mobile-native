import React from 'react';
import { LinkingOptions, NavigationContainer } from '@react-navigation/native';

export default function Navigation() {
  return (
    <NavigationContainer linking={LinkingConfiguration}>
      <></>
    </NavigationContainer>
  );
}

const LinkingConfiguration: LinkingOptions<any> = {
  prefixes: ['https://minds.com'],
  config: {
    screens: {},
  },
};
