export default function formatDate(timestamp, format=null) {
  const t = new Date(timestamp * 1000);
  return t.toDateString();
}