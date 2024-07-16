import sp from '~/services/serviceProvider';
/**
 * Validator
 */
export class ValidatorService {
  rules = {
    number: /^(([0-9]*)|(([0-9]*)\.([0-9]*)))$/,
    // RFC 5322 Official Standard Email validation
    email:
      /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
  };

  /**
   * Validate value using rule
   * @param {string} rule
   * @param {mixed} value
   */
  validate(rule, value) {
    return this.rules[rule].test(value);
  }

  /**
   * Validate value using rule
   * @param {string} rule
   * @param {mixed} value
   * @returns i18n translated message if it is invalid or null
   */
  validateMessage(rule: 'email' | 'number' | 'amount', value) {
    return !this.validate(rule, value) ? sp.i18n.t(`validation.${rule}`) : null;
  }

  /**
   * Validate email
   * @param {string} value
   * @returns boolean
   */
  email(value) {
    return this.validate('email', value);
  }

  /**
   * Validate number
   * @param {number} value
   * @returns boolean
   */
  number(value) {
    return this.validate('number', value);
  }

  /**
   * Validate email
   * @param {mixed} value
   * @returns i18n translated message if it is invalid or null
   */
  emailMessage(value) {
    return this.validateMessage('email', value);
  }

  /**
   * Validate number
   * @param {mixed} value
   * @returns i18n translated message if it is invalid or null
   */
  numberMessage(value) {
    return this.validateMessage('number', value);
  }
}

export default new ValidatorService();
