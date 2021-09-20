export default function (text: string, selection) {
  let matchText = text.substr(0, selection.end);
  // search end of word
  if (text.length > selection.end) {
    const endword = text.substr(selection.end).match(/^([a-zA-Z0-9])+\b/);
    if (endword) {
      matchText += endword[0];
    }
  }

  const isTag = matchText.match(/\@[a-zA-Z0-9]{2,}$/);
  if (isTag) {
    return isTag[0];
  } else {
    return null;
  }
}
