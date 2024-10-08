const { addToCart } = require("./addToCart");
const { cart } = require("./cart");
const { checkSuspend } = require("./checkSuspend");
const { clickPoinKoin } = require("./clickPoinKoin");
const { login } = require("./login");
const { scrollElement } = require("./scrollElement");
const { search } = require("./search");
const { uploadDownload } = require("./uploadDownload");

module.exports = {
  addToCart,
  search,
  login,
  clickPoinKoin,
  scrollElement,
  cart,
  checkSuspend,
  uploadDownload,
};
