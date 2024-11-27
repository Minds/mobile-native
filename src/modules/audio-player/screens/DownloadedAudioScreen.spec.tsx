import React from 'react';
import { render } from '@testing-library/react-native';
import sp from '~/services/serviceProvider';
import DownloadedAudioScreen from './DownloadedAudioScreen';
import useGetDownloadedList from '../hooks/useGetDownloadedList';
import { DownloadedTrack } from '../services/audio-download.service';

jest.mock('~/services/serviceProvider');

// mock services
sp.mockService('styles');
sp.mockService('i18n');
sp.mockService('audioPlayer');
sp.mockService('api');
sp.mockService('storages');
sp.mockService('settings');

jest.mock('../hooks/useGetDownloadedList', () => jest.fn());

// FlatList is not rendering in the tests (??), so we mock it to be just views
jest.mock('@shopify/flash-list', () => {
  const { View } = require('react-native');
  return {
    FlashList: ({ data, renderItem, ListEmptyComponent, testID }) => (
      <View testID={testID}>
        {data && data.length > 0
          ? data.map((item, index) => (
              <View key={index} test>
                {renderItem({ item, index })}
              </View>
            ))
          : ListEmptyComponent && <ListEmptyComponent />}
      </View>
    ),
  };
});

describe('DownloadedAudioScreen', () => {
  beforeEach(() => {
    (useGetDownloadedList as jest.Mock).mockReturnValue({
      list: {},
      count: 0,
    } as ReturnType<typeof useGetDownloadedList>);
  });

  it('renders without crashing', () => {
    const comp = render(<DownloadedAudioScreen />);
    expect(comp).toBeTruthy();
  });

  it('should have an empty list', () => {
    const comp = render(<DownloadedAudioScreen />);
    const list = comp.getByTestId('audio-list');
    expect(list).toBeTruthy();
  });

  it('should show a downloaded item', () => {
    (useGetDownloadedList as jest.Mock).mockReturnValue({
      list: {
        123: {
          id: '123',
          title: 'My spec test title',
          url: 'test',
          localFilePath: '/tmp/local',
        } as DownloadedTrack,
        456: {
          id: '456',
          title: 'My other list item',
          url: 'test',
          localFilePath: '/tmp/local',
        },
      },
      count: 2,
    } as ReturnType<typeof useGetDownloadedList>);

    const comp = render(<DownloadedAudioScreen />);
    expect(comp.getByText('My spec test title')).toBeTruthy();
    expect(comp.getByText('My other list item')).toBeTruthy();
  });
});
