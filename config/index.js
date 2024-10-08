require("dotenv").config();

const URL = {
  home: "https://bisnis.astraotoshop.com/UI/eCommerce/Home.aspx",
  login: "https://bisnis.astraotoshop.com/UI/eCommerce/Login.aspx",
  adminb2b: "https://adminb2b.astraotoshop.com/B2BR2.Admin/Auth/Login",
  cart: "https://bisnis.astraotoshop.com/UI/NewOrder/frmEntryOrder.aspx",
};

const dataLogin = {
  username: process.env.LOGIN_USERNAME,
  password: process.env.LOGIN_PASSWORD,
  usernameAdmin: process.env.LOGIN_USERNAME_ADMIN,
  passwordAdmin: process.env.LOGIN_PASSWORD_ADMIN,
};

const dataEmail = {
  service: process.env.EMAIL_SERVICE,
  user: process.env.EMAIL_USER,
  pass: process.env.EMAIL_PASS,
  to: process.env.EMAIL_TO,
  cc: process.env.EMAIL_CC,
};

const BASE_DIRECTORY = process.env.BASE_DIRECTORY;
const pathDownload = process.env.PATH_DOWNLOAD;
const pathUpload = process.env.PATH_UPLOAD;

module.exports = {
  URL,
  dataLogin,
  dataEmail,
  BASE_DIRECTORY,
  pathDownload,
  pathUpload,
};
