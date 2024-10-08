module.exports = {
  checkSuspend: async (page) => {
    let isSuspend = true;
    // Tunggu sampai <select> dengan id ddlTOP tersedia
    await page.waitForSelector("#ddlTOP", {
      visible: true,
    });
    // Cek apakah option value 9999 ada atau tidak
    const optionExists = await page.evaluate(() => {
      const selectElement = document.querySelector("#ddlTOP");
      const option = selectElement.querySelector('option[value="9999"]');
      return option !== null; // Mengembalikan true jika option ditemukan, false jika tidak
    });

    if (optionExists) isSuspend = false;
    return isSuspend;
  },
};
