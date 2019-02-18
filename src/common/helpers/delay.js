export default function(ms) {
  return new Promise(r => setTimeout(r, ms));
}