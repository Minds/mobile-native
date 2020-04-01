//@ts-nocheck
export default function getMatches(str, regex) {
  let m;
  const matches = [];

  while ((m = regex.exec(str)) !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if (m.index === regex.lastIndex) {
          regex.lastIndex++;
      }

      // The result can be accessed through the `m`-variable.
      m.forEach((match, groupIndex) => {
        matches.push(match);
      });
  }
  return matches;
}
