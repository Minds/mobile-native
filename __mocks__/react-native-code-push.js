const codePush = jest.fn();

codePush.CheckFrequency = {
  ON_APP_RESUME: 0,
};
codePush.InstallMode = {
  ON_NEXT_SUSPEND: 0,
};
codePush.SyncStatus = {
  CHECKING_FOR_UPDATE: 0,
};

export default codePush;
