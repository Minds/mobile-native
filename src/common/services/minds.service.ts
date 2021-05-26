//@ts-nocheck
import api from './api.service';
import AsyncStorage from '@react-native-community/async-storage';
import featuresService from './features.service';

/**
 * Minds Service
 */
class MindsService {
  settings;
  promise;

  /**
   * Lazy load default settings
   */
  loadDefault = () => require('../../../settings/default.json');

  /**
   * Update the settings from the server
   */
  async update() {
    const settings = await api.get('api/v1/minds/config');
    settings.blockchain.client_network = 4;
    // settings.blockchain.plus_address = 'newaddress';
    // settings.blockchain = {
    //   sale: 'sale',
    //   testnet: false,
    //   rpc_endpoints: [
    //     'https://rinkeby.infura.io/v3/480b0608763a4537b38e2da362542c3f',
    //   ],
    //   proxy_rpc_endpoint: 'https://rinkeby.infura.io/v3/480b0608763a4537b38e2da362542c3f',
    //   client_network: 1,
    //   default_gas_price: 40,
    //   server_gas_price: 40,
    //   token_symbol: 'status',
    //   token_address: '0xb26631c6dda06ad89b93c71400d25692de89c068',
    //   contracts: {
    //     token_sale_event: {
    //       contract_address: '0xf3c9dbb9598c21fe64a67d0586adb5d6eb66bc63',
    //       wallet_address: '0x1820fFAD63fD64d7077Da4355e9641dfFf4DAD0d',
    //       wallet_pkey: '',
    //       eth_rate: 2000,
    //       auto_issue_cap: '120000000000000000000000',
    //     },
    //     withdraw: {
    //       contract_address: '0xdd10ccb3100980ecfdcbb1175033f0c8fa40548c',
    //       wallet_address: '0x14E421986C5ff2951979987Cdd82Fa3C0637D569',
    //       wallet_pkey: '',
    //       limit_exemptions: [],
    //       limit: 25000,
    //     },
    //     bonus: {
    //       wallet_address: '0x461f1C5768cDB7E567A84E22b19db0eABa069BaD',
    //       wallet_pkey: '',
    //     },
    //     boost: {
    //       contract_address: '0x112ca67c8e9a6ac65e1a2753613d37b89ab7436b',
    //       wallet_address: '0xdd04D9636F1944FE24f1b4E51Ba77a6CD23b6fE3',
    //       wallet_pkey: '',
    //     },
    //     wire: {
    //       plus_address: '',
    //       plus_guid: '',
    //       contract_address: '0x4b637bba81d24657d4c6acc173275f3e11a8d5d7',
    //       wallet_address: '0x4CDc1C1fd1A3F4DD63231afF8c16501BcC11Df95',
    //       wallet_pkey: '',
    //     },
    //   },
    //   eth_rate: 2000,
    //   disable_creditcards: true,
    //   offchain: {
    //     cap: 1000,
    //   },
    //   liquidity_positions: {
    //     approved_pairs: [
    //       '0x8ff2fd6f94cdce7c56bb11328eb9928c9483aa66',
    //       '0x9f9c34109bd5fa460fad4c14fb51df99339cb46c',
    //     ],
    //   },
    //   transak: {
    //     api_key: '',
    //     environment: 'staging',
    //   },
    // };

    settings.blockchain = {
      network_address: "https://www.minds.com/api/v2/blockchain/proxy/",
      client_network: 1,
      wallet_address: null,
      boost_wallet_address: "0xdd04D9636F1944FE24f1b4E51Ba77a6CD23b6fE3",
      token_distribution_event_address: "0x36163f85add2349a973014c92afa410263311607",
      rate: 2000,
      plus_address: "0x6f2548b1bee178a49c8ea09be6845f6aeaf3e8da",
      default_gas_price: 300,
      transak: {
      api_key: "3d6540a2-7e86-46f9-927f-fbff2b743b0d",
      environment: "PRODUCTION"
      },
      overrides: [ ],
      withdraw_limit: 25000,
      token: {
      address: "0xb26631c6dda06ad89b93c71400d25692de89c068",
      abi: [
      {
      constant: true,
      inputs: [ ],
      name: "mintingFinished",
      outputs: [
      {
      name: "",
      type: "bool"
      }
      ],
      payable: false,
      type: "function"
      },
      {
      constant: true,
      inputs: [ ],
      name: "name",
      outputs: [
      {
      name: "",
      type: "string"
      }
      ],
      payable: false,
      type: "function"
      },
      {
      constant: false,
      inputs: [
      {
      name: "_spender",
      type: "address"
      },
      {
      name: "_value",
      type: "uint256"
      }
      ],
      name: "approve",
      outputs: [
      {
      name: "",
      type: "bool"
      }
      ],
      payable: false,
      type: "function"
      },
      {
      constant: true,
      inputs: [ ],
      name: "totalSupply",
      outputs: [
      {
      name: "",
      type: "uint256"
      }
      ],
      payable: false,
      type: "function"
      },
      {
      constant: false,
      inputs: [
      {
      name: "_from",
      type: "address"
      },
      {
      name: "_to",
      type: "address"
      },
      {
      name: "_value",
      type: "uint256"
      }
      ],
      name: "transferFrom",
      outputs: [
      {
      name: "",
      type: "bool"
      }
      ],
      payable: false,
      type: "function"
      },
      {
      constant: true,
      inputs: [ ],
      name: "decimals",
      outputs: [
      {
      name: "",
      type: "uint8"
      }
      ],
      payable: false,
      type: "function"
      },
      {
      constant: false,
      inputs: [
      {
      name: "_to",
      type: "address"
      },
      {
      name: "_amount",
      type: "uint256"
      }
      ],
      name: "mint",
      outputs: [
      {
      name: "",
      type: "bool"
      }
      ],
      payable: false,
      type: "function"
      },
      {
      constant: false,
      inputs: [
      {
      name: "_spender",
      type: "address"
      },
      {
      name: "_subtractedValue",
      type: "uint256"
      }
      ],
      name: "decreaseApproval",
      outputs: [
      {
      name: "success",
      type: "bool"
      }
      ],
      payable: false,
      type: "function"
      },
      {
      constant: true,
      inputs: [
      {
      name: "_owner",
      type: "address"
      }
      ],
      name: "balanceOf",
      outputs: [
      {
      name: "balance",
      type: "uint256"
      }
      ],
      payable: false,
      type: "function"
      },
      {
      constant: false,
      inputs: [ ],
      name: "finishMinting",
      outputs: [
      {
      name: "",
      type: "bool"
      }
      ],
      payable: false,
      type: "function"
      },
      {
      constant: true,
      inputs: [ ],
      name: "owner",
      outputs: [
      {
      name: "",
      type: "address"
      }
      ],
      payable: false,
      type: "function"
      },
      {
      constant: true,
      inputs: [ ],
      name: "symbol",
      outputs: [
      {
      name: "",
      type: "string"
      }
      ],
      payable: false,
      type: "function"
      },
      {
      constant: false,
      inputs: [
      {
      name: "_to",
      type: "address"
      },
      {
      name: "_value",
      type: "uint256"
      }
      ],
      name: "transfer",
      outputs: [
      {
      name: "",
      type: "bool"
      }
      ],
      payable: false,
      type: "function"
      },
      {
      constant: false,
      inputs: [
      {
      name: "_spender",
      type: "address"
      },
      {
      name: "_value",
      type: "uint256"
      },
      {
      name: "_extraData",
      type: "bytes"
      }
      ],
      name: "approveAndCall",
      outputs: [
      {
      name: "success",
      type: "bool"
      }
      ],
      payable: false,
      type: "function"
      },
      {
      constant: false,
      inputs: [
      {
      name: "_spender",
      type: "address"
      },
      {
      name: "_addedValue",
      type: "uint256"
      }
      ],
      name: "increaseApproval",
      outputs: [
      {
      name: "success",
      type: "bool"
      }
      ],
      payable: false,
      type: "function"
      },
      {
      constant: true,
      inputs: [
      {
      name: "_owner",
      type: "address"
      },
      {
      name: "_spender",
      type: "address"
      }
      ],
      name: "allowance",
      outputs: [
      {
      name: "remaining",
      type: "uint256"
      }
      ],
      payable: false,
      type: "function"
      },
      {
      constant: false,
      inputs: [
      {
      name: "newOwner",
      type: "address"
      }
      ],
      name: "transferOwnership",
      outputs: [ ],
      payable: false,
      type: "function"
      },
      {
      anonymous: false,
      inputs: [
      {
      indexed: true,
      name: "to",
      type: "address"
      },
      {
      indexed: false,
      name: "amount",
      type: "uint256"
      }
      ],
      name: "Mint",
      type: "event"
      },
      {
      anonymous: false,
      inputs: [ ],
      name: "MintFinished",
      type: "event"
      },
      {
      anonymous: false,
      inputs: [
      {
      indexed: true,
      name: "previousOwner",
      type: "address"
      },
      {
      indexed: true,
      name: "newOwner",
      type: "address"
      }
      ],
      name: "OwnershipTransferred",
      type: "event"
      },
      {
      anonymous: false,
      inputs: [
      {
      indexed: true,
      name: "owner",
      type: "address"
      },
      {
      indexed: true,
      name: "spender",
      type: "address"
      },
      {
      indexed: false,
      name: "value",
      type: "uint256"
      }
      ],
      name: "Approval",
      type: "event"
      },
      {
      anonymous: false,
      inputs: [
      {
      indexed: true,
      name: "from",
      type: "address"
      },
      {
      indexed: true,
      name: "to",
      type: "address"
      },
      {
      indexed: false,
      name: "value",
      type: "uint256"
      }
      ],
      name: "Transfer",
      type: "event"
      }
      ],
      decimals: 18
      },
      wire: {
      address: "0x4b637bba81d24657d4c6acc173275f3e11a8d5d7",
      abi: [
      {
      constant: true,
      inputs: [ ],
      name: "canIWire",
      outputs: [
      {
      name: "",
      type: "bool"
      }
      ],
      payable: false,
      type: "function"
      },
      {
      constant: false,
      inputs: [
      {
      name: "sender",
      type: "address"
      },
      {
      name: "receiver",
      type: "address"
      },
      {
      name: "amount",
      type: "uint256"
      }
      ],
      name: "wireFrom",
      outputs: [
      {
      name: "",
      type: "bool"
      }
      ],
      payable: false,
      type: "function"
      },
      {
      constant: true,
      inputs: [ ],
      name: "s",
      outputs: [
      {
      name: "",
      type: "address"
      }
      ],
      payable: false,
      type: "function"
      },
      {
      constant: false,
      inputs: [
      {
      name: "_from",
      type: "address"
      },
      {
      name: "_value",
      type: "uint256"
      },
      {
      name: "_tokenContract",
      type: "address"
      },
      {
      name: "_extraData",
      type: "bytes"
      }
      ],
      name: "receiveApproval",
      outputs: [
      {
      name: "",
      type: "bool"
      }
      ],
      payable: false,
      type: "function"
      },
      {
      constant: false,
      inputs: [
      {
      name: "receiver",
      type: "address"
      },
      {
      name: "amount",
      type: "uint256"
      }
      ],
      name: "wire",
      outputs: [
      {
      name: "",
      type: "bool"
      }
      ],
      payable: false,
      type: "function"
      },
      {
      constant: true,
      inputs: [
      {
      name: "receiver",
      type: "address"
      },
      {
      name: "amount",
      type: "uint256"
      },
      {
      name: "timestamp",
      type: "uint256"
      }
      ],
      name: "hasSent",
      outputs: [
      {
      name: "",
      type: "bool"
      }
      ],
      payable: false,
      type: "function"
      },
      {
      constant: true,
      inputs: [ ],
      name: "token",
      outputs: [
      {
      name: "",
      type: "address"
      }
      ],
      payable: false,
      type: "function"
      },
      {
      inputs: [
      {
      name: "_storage",
      type: "address"
      },
      {
      name: "_token",
      type: "address"
      }
      ],
      payable: false,
      type: "constructor"
      },
      {
      anonymous: false,
      inputs: [
      {
      indexed: false,
      name: "sender",
      type: "address"
      },
      {
      indexed: false,
      name: "receiver",
      type: "address"
      },
      {
      indexed: false,
      name: "amount",
      type: "uint256"
      }
      ],
      name: "WireSent",
      type: "event"
      }
      ]
      },
      boost: {
      address: "0x112ca67c8e9a6ac65e1a2753613d37b89ab7436b",
      abi: [
      {
      constant: false,
      inputs: [
      {
      name: "guid",
      type: "uint256"
      },
      {
      name: "receiver",
      type: "address"
      },
      {
      name: "amount",
      type: "uint256"
      },
      {
      name: "checksum",
      type: "uint256"
      }
      ],
      name: "boost",
      outputs: [
      {
      name: "",
      type: "bool"
      }
      ],
      payable: false,
      stateMutability: "nonpayable",
      type: "function"
      },
      {
      constant: false,
      inputs: [
      {
      name: "sender",
      type: "address"
      },
      {
      name: "guid",
      type: "uint256"
      },
      {
      name: "receiver",
      type: "address"
      },
      {
      name: "amount",
      type: "uint256"
      },
      {
      name: "checksum",
      type: "uint256"
      }
      ],
      name: "boostFrom",
      outputs: [
      {
      name: "",
      type: "bool"
      }
      ],
      payable: false,
      stateMutability: "nonpayable",
      type: "function"
      },
      {
      constant: false,
      inputs: [
      {
      name: "guid",
      type: "uint256"
      }
      ],
      name: "accept",
      outputs: [ ],
      payable: false,
      stateMutability: "nonpayable",
      type: "function"
      },
      {
      constant: false,
      inputs: [
      {
      name: "guid",
      type: "uint256"
      }
      ],
      name: "revoke",
      outputs: [ ],
      payable: false,
      stateMutability: "nonpayable",
      type: "function"
      },
      {
      constant: true,
      inputs: [ ],
      name: "s",
      outputs: [
      {
      name: "",
      type: "address"
      }
      ],
      payable: false,
      stateMutability: "view",
      type: "function"
      },
      {
      constant: true,
      inputs: [ ],
      name: "canIBoost",
      outputs: [
      {
      name: "",
      type: "bool"
      }
      ],
      payable: false,
      stateMutability: "view",
      type: "function"
      },
      {
      constant: false,
      inputs: [
      {
      name: "_from",
      type: "address"
      },
      {
      name: "_value",
      type: "uint256"
      },
      {
      name: "_tokenContract",
      type: "address"
      },
      {
      name: "_extraData",
      type: "bytes"
      }
      ],
      name: "receiveApproval",
      outputs: [
      {
      name: "",
      type: "bool"
      }
      ],
      payable: false,
      stateMutability: "nonpayable",
      type: "function"
      },
      {
      constant: false,
      inputs: [
      {
      name: "guid",
      type: "uint256"
      }
      ],
      name: "reject",
      outputs: [ ],
      payable: false,
      stateMutability: "nonpayable",
      type: "function"
      },
      {
      constant: true,
      inputs: [ ],
      name: "token",
      outputs: [
      {
      name: "",
      type: "address"
      }
      ],
      payable: false,
      stateMutability: "view",
      type: "function"
      },
      {
      inputs: [
      {
      name: "_storage",
      type: "address"
      },
      {
      name: "_token",
      type: "address"
      }
      ],
      payable: false,
      stateMutability: "nonpayable",
      type: "constructor"
      },
      {
      anonymous: false,
      inputs: [
      {
      indexed: false,
      name: "guid",
      type: "uint256"
      }
      ],
      name: "BoostSent",
      type: "event"
      },
      {
      anonymous: false,
      inputs: [
      {
      indexed: false,
      name: "guid",
      type: "uint256"
      }
      ],
      name: "BoostAccepted",
      type: "event"
      },
      {
      anonymous: false,
      inputs: [
      {
      indexed: false,
      name: "guid",
      type: "uint256"
      }
      ],
      name: "BoostRejected",
      type: "event"
      },
      {
      anonymous: false,
      inputs: [
      {
      indexed: false,
      name: "guid",
      type: "uint256"
      }
      ],
      name: "BoostRevoked",
      type: "event"
      }
      ]
      },
      withdraw: {
      address: "0xdd10ccb3100980ecfdcbb1175033f0c8fa40548c",
      abi: [
      {
      constant: false,
      inputs: [
      {
      name: "requester",
      type: "address"
      },
      {
      name: "user_guid",
      type: "uint256"
      },
      {
      name: "gas",
      type: "uint256"
      },
      {
      name: "amount",
      type: "uint256"
      }
      ],
      name: "complete",
      outputs: [
      {
      name: "",
      type: "bool"
      }
      ],
      payable: false,
      stateMutability: "nonpayable",
      type: "function"
      },
      {
      constant: true,
      inputs: [
      {
      name: "",
      type: "uint256"
      }
      ],
      name: "requests",
      outputs: [
      {
      name: "requester",
      type: "address"
      },
      {
      name: "user_guid",
      type: "uint256"
      },
      {
      name: "gas",
      type: "uint256"
      },
      {
      name: "amount",
      type: "uint256"
      }
      ],
      payable: false,
      stateMutability: "view",
      type: "function"
      },
      {
      constant: false,
      inputs: [
      {
      name: "user_guid",
      type: "uint256"
      },
      {
      name: "amount",
      type: "uint256"
      }
      ],
      name: "request",
      outputs: [ ],
      payable: true,
      stateMutability: "payable",
      type: "function"
      },
      {
      constant: true,
      inputs: [ ],
      name: "token",
      outputs: [
      {
      name: "",
      type: "address"
      }
      ],
      payable: false,
      stateMutability: "view",
      type: "function"
      },
      {
      inputs: [
      {
      name: "_token",
      type: "address"
      }
      ],
      payable: false,
      stateMutability: "nonpayable",
      type: "constructor"
      },
      {
      payable: true,
      stateMutability: "payable",
      type: "fallback"
      },
      {
      anonymous: false,
      inputs: [
      {
      indexed: false,
      name: "requester",
      type: "address"
      },
      {
      indexed: false,
      name: "user_guid",
      type: "uint256"
      },
      {
      indexed: false,
      name: "gas",
      type: "uint256"
      },
      {
      indexed: false,
      name: "amount",
      type: "uint256"
      }
      ],
      name: "WithdrawalRequest",
      type: "event"
      },
      {
      anonymous: false,
      inputs: [
      {
      indexed: false,
      name: "requester",
      type: "address"
      },
      {
      indexed: false,
      name: "user_guid",
      type: "uint256"
      },
      {
      indexed: false,
      name: "amount",
      type: "uint256"
      }
      ],
      name: "WithdrawalComplete",
      type: "event"
      }
      ]
      }
      },
    await AsyncStorage.setItem('@MindsSettings', JSON.stringify(settings));
    this.settings = settings;
    // update the features based on the settings
    featuresService.updateFeatures();
  }

  /**
   * Get settings
   */
  getSettings() {
    if (!this.promise || this.settings) {
      this.promise = this._getSettings();
    }
    return this.promise;
  }

  /**
   * Get settings
   */
  async _getSettings() {
    let settings;
    if (!this.settings) {
      try {
        settings = JSON.parse(await AsyncStorage.getItem('@MindsSettings'));
        if (!settings) {
          throw Error('No settings stored');
        }
      } catch {
        settings = this.loadDefault();
        await AsyncStorage.setItem('@MindsSettings', JSON.stringify(settings));
      }
      this.settings = settings;
      // update the features based on the settings
      featuresService.updateFeatures();
      this.update();
    }

    return this.settings;
  }

  /**
   * clear
   */
  clear() {
    this.settings = undefined;
    AsyncStorage.removeItem('@MindsSettings');
  }
}

export default new MindsService();
