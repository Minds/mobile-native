function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default delay;
