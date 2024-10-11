const { login } = require("../components");
const {
  selectorList: { inputUsername, inputPassword, btnLogin },
} = require("../constant");
const {
  dataLogin: { username, password },
} = require("../config");
const { logToFile, loggerNew } = require("../utils");

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
    logToFile("Login Page - Try to Login");
    loggerNew.info("Login Page - Try to Login tapi loggerNew")
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
