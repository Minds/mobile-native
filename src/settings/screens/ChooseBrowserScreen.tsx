import React from 'react';
import ChooseBrowser from '../components/ChooseBrowser';
import { Screen } from '~/common/ui';

type PropsType = {};

/**
 * Settings choose browser for links
 */
const ChooseBrowserScreen = ({}: PropsType) => {
  return (
    <Screen>
      <ChooseBrowser />
    </Screen>
  );
};

export default ChooseBrowserScreen;
