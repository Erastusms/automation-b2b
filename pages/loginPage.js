const { login } = require("../components");
const {
  dataLogin: { username, password },
} = require("../config");

const loginPage = async (page) => {
  try {
    // const login_failed = await login(page, username, "test");
    const login_success = await login(page, username, password);

    return { login_success };
    // return { login_failed, login_success };
  } catch (err) {
    console.error(err);
  }
};

module.exports = {
  loginPage,
};
