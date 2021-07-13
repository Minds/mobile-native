beforeAll(async () => {
  await device.launchApp({
    permissions: {
      notifications: 'YES',
      camera: 'YES',
      medialibrary: 'YES',
      photos: 'YES',
    },
  });
});
