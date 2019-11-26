describe('Example', () => {
  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should have login screen', async () => {
    await expect(element(by.id('usernameInput'))).toBeVisible();
  });
});
