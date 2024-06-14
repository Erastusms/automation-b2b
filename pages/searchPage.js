const { addToCart, search } = require("../components");
const {
  selectorList: { searchAddToCart },
} = require("../constant");

const searchPage = async (page) => {
  try {
    const searchProduct = await search(page);
    const searchAddProduct = await addToCart(page, searchAddToCart);
    const search_product = searchProduct.concat(searchAddProduct);

    return { search_product };
  } catch (err) {
    console.error(err);
  }
};

module.exports = {
  searchPage,
};
