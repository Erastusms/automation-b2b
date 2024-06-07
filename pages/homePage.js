const { addToCart, search } = require("../components");
const {
  selectorList: { skuRecom, skuUnggulan, skuUnggulanDetail, searchAddToCart },
} = require("../constant");

const homePage = async (page) => {
  try {
    const home_add_sku = await addToCart(page, skuRecom);

    const home_add_sku_with_detail = await addToCart(
      page,
      skuUnggulan,
      skuUnggulanDetail
    );

    const searchProduct = await search(page);
    const searchAddProduct = await addToCart(page, searchAddToCart);
    const search_product = searchProduct.concat(searchAddProduct);

    return { home_add_sku, home_add_sku_with_detail, search_product };
  } catch (err) {
    console.error(err);
  }
};

module.exports = {
  homePage,
};
