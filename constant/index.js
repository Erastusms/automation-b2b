const URL = {
  home: "https://bisnis.astraotoshop.com/UI/eCommerce/Home.aspx",
  login: "https://bisnis.astraotoshop.com/UI/eCommerce/Login.aspx",
};

const dataLogin = {
  username: "1000013132",
  password: "Christian1",
};

const selectorList = {
  XPathBtnTextLogin:
    '//*[@id="ctl00_panelWebsiteWidth"]/table/tbody/tr[1]/td/table/tbody/tr/td/table/tbody/tr[2]/td/table/tbody/tr/td[2]/table/tbody/tr[1]/td[1]/a',
  inputUsername: "#ctl00_ContentPlaceHolder1_txtUserName",
  inputPassword: "#ctl00_ContentPlaceHolder1_txtPassword",
  btnLogin: "#ctl00_ContentPlaceHolder1_btnLogin",
  XPathBtnOKAddToCart: '//*[@id="ucModalProductSuccessAdd_ButtonOk"]/td/input',
  searchField: "#txtSearchEngine1",
  searchWord: "gsmf",
  searchBtn: "#btnSearchEngine1",
  searchAddToCart: "#btnAddToCart_GSMF-GTZ-4V",
  skuRecom: "#btnAddToCart_FP-06435-KPP-2700",
  skuUnggulan: "#btnAddToCart_GSMF-GM5Z-3B",
  skuUnggulanDetail: "#btnProductDetails_GSMF-GM5Z-3B",
  skuUnggulanSparePart: "#btnAddToCart_TO-15601-AVZ-1800",
  btnSuccessAddToCart: "input.ButtonAction[value='Ok']",
  btnAddTroliDetail: "input.ButtonAction[value='Tambah Ke Troli']",
};

module.exports = {
  URL,
  dataLogin,
  selectorList,
};
