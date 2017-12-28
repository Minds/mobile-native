import { RSA, RSAKeychain } from 'react-native-rsa-native';

class CryptoService {
  privateKey = null;

  setPrivate(pem) {
    const rs = require('jsrsasign');
    //convert pkcs8 to pkcs1
    const pk = rs.KEYUTIL.getKeyFromPlainPrivatePKCS8PEM(pem);
    this.privateKey = rs.KEYUTIL.getPEM(pk, 'PKCS1PRV');
  }

  async decrypt(message) {
    const msg = await RSA.decrypt(message, this.privateKey)
    return msg;
  }
}

export default new CryptoService();