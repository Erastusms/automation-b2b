const { addToCart, search } = require("../components");
const {
  selectorList: { searchAddToCart },
} = require("../constant");
const { readDataExcel } = require("../utils/excelHelper");

const searchPage = async (page) => {
  const dataSearch = [];
  try {
    const data = readDataExcel(1);

    for (let i = 0; i < 1; i++) {
      const searchSKUID = data[i].SKU_ID;
      const searchProduct = await search(page, searchSKUID, i);
      const searchAddProduct = await addToCart(page, searchSKUID);
      dataSearch.push(searchProduct.concat(searchAddProduct));
    }

    return { search_product: dataSearch.flat() };
  } catch (err) {
    console.error(err);
  }
};

module.exports = {
  searchPage,
};
