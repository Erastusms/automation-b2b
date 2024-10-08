const { addToCart, clickPoinKoin } = require("../components");
const { URL } = require("../config");
const {
  selectorList: { skuRecom, skuUnggulan, skuUnggulanDetail },
} = require("../constant");

const homePage = async (page) => {
  await page.goto(URL.home, { timeout: 0, waitUntil: "networkidle0" });

  try {
    const home_view_point = await clickPoinKoin(page, "Point");
    const home_view_koin = await clickPoinKoin(page, "Koin");

    const home_add_sku = await addToCart(page, skuRecom);
    const home_add_sku_with_detail = await addToCart(
      page,
      skuUnggulan,
      skuUnggulanDetail
    );

    return {
      home_view_point,
      home_view_koin,
      home_add_sku,
      home_add_sku_with_detail,
    };
  } catch (err) {
    console.error(err);
  }
};

module.exports = {
  homePage,
};
