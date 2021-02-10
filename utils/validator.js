module.exports = {
  isURL: (v) => /https?:\/\/(w{3}\.)?[0-9a-z-._~:/?#[\]@!$&'()*+,;=]+#?/.test(v),
};
