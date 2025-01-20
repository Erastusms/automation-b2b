const { login } = require("../components");
const {
  selectorList: { inputUsername, inputPassword, btnLogin },
} = require("../constant");
const {
  dataLogin: { username, password },
} = require("../config");
const { logToFile } = require("../utils");
const { readDataExcel } = require("../utils/excelHelper");

const loginPage = async (page, endX, endY) => {
  const data = readDataExcel(0);
  const options = {
    inputUsername,
    inputPassword,
    btnLogin,
    username: data[0].Username,
    password: data[0].Password,
    endX,
    endY,
  };
  try {
    // const login_failed = await login(page, username, "test");
    logToFile("Login Page - Try to Login");
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
