import Encryption from 'react-native-minds-encryption';

/**
 * RSA crypto Service
 */
class CryptoService {
  privateKey = null;
  publicKeys = {};

  /**
   * Set private key
   * @param {string} key
   */
  setPrivateKey(key) {
    //convert pkcs8 to pkcs1
    this.privateKey = key;
  }

  /**
   * Set the array of public keys
   * @param {array} keys
   */
  setPublicKeys(keys) {
    this.publicKeys = keys;
  }

  /**
   * Get public keys
   */
  getPublicKeys() {
    return this.publicKeys;
  }

  /**
   * Descript a message
   * @param {string} message
   */
  decrypt(message) {
    return Encryption.decrypt(message, this.privateKey)
  }

  /**
   * Encrypt a message
   * @param {string} message
   * @param {numeric} keyIndex
   */
  encrypt(message, keyIndex) {
    if (!this.publicKeys[keyIndex]) throw keyIndex + ' public key is not defined';
    return Encryption.encrypt(message, this.publicKeys[keyIndex])
  }
}

export default new CryptoService();