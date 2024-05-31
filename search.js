const { selectorList } = require("./constant");

module.exports = {
  search: async (page) => {
    await page.type(selectorList.searchField, selectorList.searchWord);
    const btnSearch = await page.waitForSelector(selectorList.searchBtn, {
      visible: true,
    });

    await Promise.all([
      btnSearch.click(),
      page.waitForNavigation({ waitUntil: "networkidle0" }),
    ]);
  },
};
