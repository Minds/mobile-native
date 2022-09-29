import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import SupermindConsoleFeedFilter, {
  SupermindFilterType,
} from './SupermindConsoleFeedFilter';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

describe('SupermindFeedFilter', () => {
  it('should render', async () => {
    render(
      <BottomSheetModalProvider>
        <SupermindConsoleFeedFilter
          onFilterChange={v => console.log(v)}
          value="accepted"
        />
      </BottomSheetModalProvider>,
    );

    expect(screen.toJSON()).toMatchSnapshot();
  });

  it('It should fire onChange', async () => {
    let current: SupermindFilterType = 'accepted';

    const onFilterChange = jest.fn();

    render(
      <BottomSheetModalProvider>
        <SupermindConsoleFeedFilter
          onFilterChange={onFilterChange}
          value={current}
        />
      </BottomSheetModalProvider>,
    );

    // press accepted
    fireEvent.press(screen.getByTestId('AcceptedRadio'));

    expect(onFilterChange).toBeCalledWith('accepted');

    // press failed
    fireEvent.press(screen.getByTestId('FailedRadio'));

    expect(onFilterChange).toBeCalledWith('failed');

    // press expired
    fireEvent.press(screen.getByTestId('ExpiredRadio'));

    expect(onFilterChange).toBeCalledWith('expired');

    // press pending
    fireEvent.press(screen.getByTestId('PendingRadio'));

    expect(onFilterChange).toBeCalledWith('pending');
  });
});
