const { login } = require("../components");
const {
  selectorList: { inputUsername, inputPassword, btnLogin },
} = require("../constant");
const {
  dataLogin: { username, password },
} = require("../config");

const loginPage = async (page) => {
  const options = {
    inputUsername,
    inputPassword,
    btnLogin,
    username,
    password,
  };
  try {
    // const login_failed = await login(page, username, "test");
    const login_success = await login(page, options);

    return { login_success };
    // return { login_failed, login_success };
  } catch (err) {
    console.error(err);
  }
};

module.exports = {
  loginPage,
};
