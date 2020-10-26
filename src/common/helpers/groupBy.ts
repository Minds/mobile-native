export default <T>(arr: T[], key: string): {} => {
  return arr.reduce((prev, curr) => {
    (prev[curr[key]] = prev[curr[key]] || []).push(curr);
    return prev;
  }, {});
};
