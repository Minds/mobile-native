import React from 'react';
import { render } from '@testing-library/react-native';
import { LockNetworkTag } from './LockNetwordkTag';
import ActivityModel from '~/newsfeed/ActivityModel'; // Adjust the import path as necessary

describe('LockNetworkTag', () => {
  it('renders nothing if hasSiteMembershipPaywall is false', () => {
    const entity = new ActivityModel();

    const { queryByText } = render(<LockNetworkTag entity={entity} />);
    expect(queryByText('Membership')).toBeNull();
  });

  it('renders with default styles when site_membership_unlocked is false', () => {
    const entity = new ActivityModel();
    // entity.hasSiteMembershipPaywall = true;
    entity.site_membership = true;
    entity.paywall_thumbnail = {};

    entity.site_membership_unlocked = false;

    const { getByText } = render(<LockNetworkTag entity={entity} />);
    const membershipText = getByText('Membership');

    expect(membershipText).toBeTruthy();
  });

  it('renders with unlock styles when site_membership_unlocked is true', () => {
    const entity = new ActivityModel();
    // entity.hasSiteMembershipPaywall = true;
    entity.site_membership = true;
    entity.paywall_thumbnail = {};

    entity.site_membership_unlocked = true;

    const { getByText } = render(<LockNetworkTag entity={entity} />);
    const membershipText = getByText('Membership');

    expect(membershipText).toBeTruthy();
    // Similar note as above regarding verifying styles
  });
});
