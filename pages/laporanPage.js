const { scrollElement } = require("../components");
const { timeCalc, waiting, logToFile } = require("../utils");

const FILTER_EXPIRED_NUMBER = "2";
const optionStatusSelector = "#ddlStatus";

const laporanPage = async (page) => {
  const laporan_page = [];
  let start = performance.now();
  let isTestCaseSuccess = true;
  try {
    await waiting(2000);
    await Promise.all([
      page.click("#ProductApplication_linkLaporan"),
      page.click("#ProductApplication_ulLaporan > li:first-child"),
      page.waitForNavigation({ waitUntil: "networkidle2" }),
    ]);
    let end = performance.now();

    const clickLaporan = {
      testCase: "Klik Menu Laporan",
      duration: await timeCalc(end, start),
      isTestCaseSuccess,
    };

    laporan_page.push(clickLaporan);
    // console.log(clickLaporan);
    await waiting(1000);
    await page.select(optionStatusSelector, FILTER_EXPIRED_NUMBER);
    // await Promise.all([
    //   page.waitForSelector("#ddlStatus", { visible: true }),
    //   page.select("#ddlStatus", FILTER_EXPIRED_NUMBER),
    // ]);

    await waiting(1000);
    await page.click("#btnSearch.ButtonAction");
    await waiting(1000);

    // Periksa apakah teks "Tidak ada data dalam 31 hari terakhir" muncul
    const isTextPresent = await page.evaluate((FILTER_EXPIRED_NUMBER) => {
      const element = document.querySelector(
        `#GridBody${FILTER_EXPIRED_NUMBER}`
      );
      return (
        element &&
        element.innerText.includes("Tidak ada data dalam 31 hari terakhir")
      );
    }, FILTER_EXPIRED_NUMBER);

    // Log hasil pengecekan
    if (isTextPresent) {
      // ini udah bisa nanti lanjut bikin if lagi aje
      console.log("Teks 'Tidak ada data dalam 31 hari terakhir' muncul.");
      await page.select(optionStatusSelector, '1');
  
      await waiting(1000);
      await page.click("#btnSearch.ButtonAction");
      await waiting(1000);

      await page.evaluate(() => {
        const element = document.querySelector(".GridButtonView");
        element.click(); // Mengklik elemen
      });

      await page.waitForNavigation({waitUntil: "networkidle2"})

      start = performance.now();
      const btnKembali = await page.waitForSelector("#btnCancel", {
        visible: true,
      });
      const scrollLihatVA = await scrollElement(start, page, "#btnCancel");

      laporan_page.push(scrollLihatVA);

      await waiting(1000);
      await btnKembali.click();
      end = performance.now();
      const lihatDetailOrder = {
        testCase: "Lihat Detail Order Teratas",
        duration: await timeCalc(end, start),
        isTestCaseSuccess,
      };

      laporan_page.push(lihatDetailOrder);
    } else {
      logToFile("Ada Order yang tercreate");
      logToFile("Klik element payment");
      await page.evaluate(() => {
        const element = document.querySelector(".GridButtonEdit");
        element.click(); // Mengklik elemen
      });
      // Cetak seluruh ID ke console
      // console.log("IDs dalam #divWidget45_Carousel:", ids);
      // await page.waitForNavigation({ waitUntil: "networkidle2" });

      await waiting(2000);
      start = performance.now();
      const btnKembali = await page.waitForSelector("#btnCancel", {
        visible: true,
      });
      const scrollLihatVA = await scrollElement(start, page, "#btnCancel");

      laporan_page.push(scrollLihatVA);

      await waiting(1000);
      await btnKembali.click();
      end = performance.now();
      const showPaymentVA = {
        testCase: "Lihat Nomor VA Order",
        duration: await timeCalc(end, start),
        isTestCaseSuccess,
      };

      laporan_page.push(showPaymentVA);
    }
    return { laporan_page };
  } catch (err) {
    console.error(err);
    logToFile(`Error: ${err.message}`);
  }
};

module.exports = {
  laporanPage,
};
