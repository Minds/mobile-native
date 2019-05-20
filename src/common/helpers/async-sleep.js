export default function asyncSleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}
