const createToken = () => {
  const characters =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let token = "";
  for (let i = 0; i < 4; i++) {
    token += characters[Math.floor(Math.random() * characters.length)];
  }
  return token;
};

module.exports = {
  createToken,
};

const genrateRendomePassword = () => {
  const characters =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let password = "";
  for (let i = 0; i < 8; i++) {
    password += characters[Math.floor(Math.random() * characters.length)];
  }
  return password;
};

module.exports = {
  createToken,
  genrateRendomePassword,
};
