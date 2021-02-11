const urlRegExp = /https?:\/\/(w{3}\.)?[0-9a-z-._~:/?#[\]@!$&'()*+,;=]+#?/;
const isURL = (v) => urlRegExp.test(v);

module.exports = {
  urlRegExp,
  isURL,
};
