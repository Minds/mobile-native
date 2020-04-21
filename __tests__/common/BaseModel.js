import BaseModel from '../../src/common/BaseModel';
import featuresService from '../../src/common/services/features.service';

describe('base model', () => {
  beforeEach(() => {});

  it('should set and validate permissions', () => {
    featuresService.features = { permissions: true };

    const data = {
      permissions: ['permissions1', 'permissions2', 'permissions3'],
    };

    const model = new BaseModel({});
    model.setPermissions(data);

    // should validate permissions
    expect(model.can('permissions1')).toBe(true);
    expect(model.can('permissions2')).toBe(true);
    expect(model.can('permissions3')).toBe(true);
    expect(model.can('permissions4')).toBe(false);
  });
});
