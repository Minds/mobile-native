import * as Updates from 'expo-updates';

export class UpdateExpoService {
  checkResult = undefined as Updates.UpdateCheckResult | undefined;

  fetchResult = undefined as Updates.UpdateFetchResult | undefined;

  async checkForUpdate(): Promise<Updates.UpdateCheckResult | undefined> {
    try {
      this.checkResult = await Updates.checkForUpdateAsync();
    } catch (err) {
      this.checkResult = {
        isAvailable: false,
        manifest: undefined,
        isRollBackToEmbedded: false,
      };
    }
    return this.checkResult;
  }

  async update(): Promise<Updates.UpdateFetchResult | undefined> {
    if (this.checkResult?.isAvailable && this.checkResult?.manifest) {
      try {
        this.fetchResult = await Updates.fetchUpdateAsync();
      } catch (error) {
        this.fetchResult = await Updates.fetchUpdateAsync().catch(
          () => undefined,
        );
      }
    }
    return this.fetchResult;
  }
  async reload() {
    await Updates.reloadAsync();
  }
}

export default new UpdateExpoService();

