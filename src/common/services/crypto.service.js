import { RSA, RSAKeychain } from 'react-native-rsa-native';

/**
 * RSA crypto Service
 */
class CryptoService {
  privateKey = null;
  publicKeys = {};

  /**
   * Convert a pkcs8 key to pkcs1
   * @param {string} key
   */
  _convertPkcs8ToPkcs1(key, type) {
    const rs = require('jsrsasign');
    const pk = rs.KEYUTIL.getKeyFromPlainPrivatePKCS8PEM(key);
    return rs.KEYUTIL.getPEM(pk, type);
  }

  /**
   * Set private key
   * @param {string} key
   */
  setPrivateKey(key) {
    //convert pkcs8 to pkcs1
    this.privateKey = this._convertPkcs8ToPkcs1(key, 'PKCS1PRV')
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
    return RSA.decrypt(message, this.privateKey)
  }

  /**
   * Encrypt a message
   * @param {string} message
   * @param {numeric} keyIndex
   */
  encrypt(message, keyIndex) {
    if (!this.publicKeys[keyIndex]) throw keyIndex+' public key is not defined';
    return RSA.encrypt(message, this.publicKeys[keyIndex])
  }
}

export default new CryptoService();