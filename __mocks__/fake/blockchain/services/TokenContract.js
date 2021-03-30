export default {
  options: {
    address: '0xADADADAD',
  },
  methods: {
    approve: jest.fn(),
    balanceOf: jest.fn(),
    approveAndCall: jest.fn(),
  },
};
