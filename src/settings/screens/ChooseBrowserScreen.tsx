import React from 'react';
import { ScrollView } from 'react-native';
import ThemedStyles from '~/styles/ThemedStyles';
import ChooseBrowser from '../components/ChooseBrowser';

type PropsType = {};

/**
 * Settings choose browser for links
 */
const ChooseBrowserScreen = ({}: PropsType) => {
  return (
    <ScrollView style={styles.container}>
      <ChooseBrowser />
    </ScrollView>
  );
};

export default ChooseBrowserScreen;

const styles = ThemedStyles.create({
  container: ['flexContainer', 'bgPrimaryBackground'],
});
