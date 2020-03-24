const feedService = function() {
  this.getEntities = jest.fn();
  this.prepend = jest.fn();
  this.setPaginated =jest.fn().mockImplementation(() => this);
  this.setInjectBoost = jest.fn().mockImplementation(() => this);
  this.setLimit = jest.fn().mockImplementation(() => this);
  this.setOffset = jest.fn().mockImplementation(() => this);
  this.setEndpoint = jest.fn().mockImplementation(() => this);
  this.setParams = jest.fn().mockImplementation(() => this);
  this.setAsActivities = jest.fn().mockImplementation(() => this);
  this.fetch = jest.fn();
  this.fetchLocal = jest.fn();
  this.fetchRemoteOrLocal = jest.fn();
  this.fetchLocalOrRemote = jest.fn();
}

export default feedService;