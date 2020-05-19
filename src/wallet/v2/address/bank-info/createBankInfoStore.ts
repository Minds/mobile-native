const createBankInfoStore = (wallet) => ({
  loading: false,
  stripeAgree: false,
  wallet: wallet,
  setLoading(loading: boolean) {
    this.loading = loading;
  },
  setCountry(country: string) {
    this.wallet.stripeDetails.country = country;
  },
  setFirstName(firstName: string) {
    this.wallet.stripeDetails.firstName = firstName;
  },
  setLastName(lastName: string) {
    this.wallet.stripeDetails.lastName = lastName;
  },
  setDob(dob: string) {
    this.wallet.stripeDetails.dob = dob;
  },
  get dob() {
    return this.wallet.stripeDetails.dob
      ? new Date(this.wallet.stripeDetails.dob).toLocaleDateString()
      : '';
  },
  setPhoneNumber(phoneNumber: string) {
    this.wallet.stripeDetails.phoneNumber = phoneNumber;
  },
  setPersonalId(personalId: string) {
    this.wallet.stripeDetails.personalIdNumber = personalId;
  },
  setSsn(ssn: string) {
    this.wallet.stripeDetails.ssn = ssn;
  },
  setAddress(address: string) {
    this.wallet.stripeDetails.street = address;
  },
  setCity(city: string) {
    this.wallet.stripeDetails.city = city;
  },
  setState(state: string) {
    this.wallet.stripeDetails.state = state;
  },
  setPostCode(postCode: string) {
    this.wallet.stripeDetails.postCode = postCode;
  },
  setStripeAgree() {
    this.stripeAgree = !this.stripeAgree;
  },
  isCountry(countries: Array<string>) {
    return countries.some(
      (country) => this.wallet.stripeDetails.country === country,
    );
  },
  setIban(iban: string) {
    this.wallet.stripeDetails.accountNumber = iban;
  },
  setSortCode(sortCode: string) {
    this.wallet.stripeDetails.routingNumber = sortCode;
  },
  validate(form, validator: string) {
    const validators = {
      personalIdNumber:
        this.isCountry(['CA', 'HK', 'SG']) &&
        (!form.personalIdNumber || form.personalIdNumber === ''),
      ssn: this.isCountry(['US']) && (!form.ssn || form.ssn === ''),
      state:
        this.isCountry(['AU', 'CA', 'IE', 'US']) &&
        (!form.state || form.state === ''),
      postCode:
        !this.isCountry(['HK', 'IE']) &&
        (!form.postCode || form.postCode === ''),
      firstName: !form.firstName || form.firstName === '',
      lastName: !form.lastName || form.lastName === '',
      street: !form.street || form.street === '',
      city: !this.isCountry(['SG']) && (!form.city || form.city === ''),
      country: !form.country || form.country === '',
      dob: !form.dob,
      stripeAgree: !form.stripeAgree,
      accountNumber: !form.accountNumber || form.accountNumber === '',
      routingNumber:
        this.isCountry(['US']) &&
        (!form.routingNumber || form.routingNumber === ''),
    };

    return !validators[validator];
  },
});

export default createBankInfoStore;
export type BankInfoStore = ReturnType<typeof createBankInfoStore>;
