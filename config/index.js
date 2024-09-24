require("dotenv").config();

const URL = {
  home: "https://bisnis.astraotoshop.com/UI/eCommerce/Home.aspx",
  login: "https://bisnis.astraotoshop.com/UI/eCommerce/Login.aspx",
};

const dataLogin = {
  username: process.env.LOGIN_USERNAME,
  password: process.env.LOGIN_PASSWORD,
};

const dataEmail = {
    service: process.env.EMAIL_SERVICE,
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
    to: process.env.EMAIL_TO,
}

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
