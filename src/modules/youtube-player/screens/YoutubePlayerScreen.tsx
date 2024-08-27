import { View, StyleSheet, useWindowDimensions } from 'react-native';
import React from 'react';
import YoutubePlayer from 'react-native-youtube-iframe';
import { useAppState } from '@react-native-community/hooks';

import { showNotification } from 'AppMessages';

export default function YoutubePlayerScreen({ route }) {
  const videoId = route.params?.videoId;
  if (!videoId) {
    showNotification('No video ID provided');
  }
  const state = useAppState();
  const [playing, setPlaying] = React.useState(true);
  const { width } = useWindowDimensions();

  React.useEffect(() => {
    setPlaying(state === 'active');
  }, [state]);

  return (
    <View style={styles.container}>
      <YoutubePlayer
        height={300}
        width={width}
        play={playing}
        videoId={videoId}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
});
