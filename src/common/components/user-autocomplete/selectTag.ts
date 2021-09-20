/**
 * Replace the partial tag with the selected
 * returns the full text
 * @param username to replace with
 * @param text searched
 * @param selection
 * @param onSelect
 */
export default function (
  username: string,
  text: string,
  selection: any,
  onSelect: Function,
) {
  let endword: RegExpMatchArray | null = [''],
    matchText = text.substr(0, selection.end);

  // search end of word
  if (text.length > selection.end) {
    endword = text.substr(selection.end).match(/^([a-zA-Z0-9])+\b/);
    if (endword) {
      matchText += endword[0];
    } else {
      endword = [''];
    }
  }

  // the rest of the text
  const postText = text.substr(selection.end + 1 + endword[0].length);

  onSelect(
    matchText.replace(/\@[a-zA-Z0-9]+$/, '@' + username + ' ' + postText),
  );
}
