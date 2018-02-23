import i18n from './i18n.service';

/**
 * Validator
 */
class ValidatorService {
  rules = {
    number: /^(([0-9]*)|(([0-9]*)\.([0-9]*)))$/,
    email: /^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/,
  }

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
  validateMessage(rule, value) {
    return !this.validate(rule, value) ? i18n.t('validation.' + rule) : null;
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