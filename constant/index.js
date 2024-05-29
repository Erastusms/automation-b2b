const URL_B2B = "https://bisnis.astraotoshop.com/UI/eCommerce/Home.aspx";

const dataLogin = {
  username: "1000013132",
  password: "Christian1",
};

const selectorList = {
  XPathBtnTextLogin:
    '//*[@id="ctl00_panelWebsiteWidth"]/table/tbody/tr[1]/td/table/tbody/tr/td/table/tbody/tr[2]/td/table/tbody/tr/td[2]/table/tbody/tr[1]/td[1]/a',
  inputUsername: "#ctl00_ContentPlaceHolder1_txtUserName",
  inputPassword: "#ctl00_ContentPlaceHolder1_txtPassword",
  btnLogin: "ctl00_ContentPlaceHolder1_btnLogin",
};

module.exports = {
  URL_B2B,
  dataLogin,
  selectorList,
};
