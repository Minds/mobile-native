import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import SupermindConsoleFeedFilter, {
  SupermindFilterType,
} from './SupermindConsoleFeedFilter';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import sp from '~/services/serviceProvider';

jest.mock('~/services/serviceProvider');
// mock services
sp.mockService('styles');
sp.mockService('i18n');

jest.mock('~/common/components/feed-filters/BaseFeedFilter', () => {
  return jest.fn().mockImplementation(({ children }) => {
    return <>{children}</>;
  });
});

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
    fireEvent.press(screen.getByTestId('acceptedRadio'));

    expect(onFilterChange).toBeCalledWith('accepted');

    // press failed
    fireEvent.press(screen.getByTestId('failedRadio'));

    expect(onFilterChange).toBeCalledWith('failed');

    // press expired
    fireEvent.press(screen.getByTestId('expiredRadio'));

    expect(onFilterChange).toBeCalledWith('expired');

    // press pending
    fireEvent.press(screen.getByTestId('pendingRadio'));

    expect(onFilterChange).toBeCalledWith('pending');

    // press revoked
    fireEvent.press(screen.getByTestId('revokedRadio'));

    expect(onFilterChange).toBeCalledWith('revoked');

    // press declined
    fireEvent.press(screen.getByTestId('declinedRadio'));

    expect(onFilterChange).toBeCalledWith('declined');

    // press paymentFailed
    fireEvent.press(screen.getByTestId('paymentFailedRadio'));

    expect(onFilterChange).toBeCalledWith('paymentFailed');
  });
});
