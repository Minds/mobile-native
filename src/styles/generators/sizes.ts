export default function sizes(name: string) {
  const regex = /^(width|height)(\d?\d)/g;
  const result = regex.exec(name);

  if (result) {
    return { [result[1]]: `${result[2]}%` };
  }
}
