export default function (str) {
  const lengthCheck = str.length >= 8;
  const specialCharCheck = /[^a-zA-Z\d]/.exec(str) !== null;
  const mixedCaseCheck =
    /[a-z]/.exec(str) !== null && /[A-Z]/.exec(str) !== null;
  const numbersCheck = /\d/.exec(str) !== null;
  const spacesCheck = /\s/.exec(str) === null;

  return {
    lengthCheck,
    specialCharCheck,
    mixedCaseCheck,
    numbersCheck,
    spacesCheck,
    all:
      lengthCheck &&
      specialCharCheck &&
      mixedCaseCheck &&
      numbersCheck &&
      spacesCheck,
  };
}
