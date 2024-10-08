const path = require("path");
const {
  selectorList: { cartIFrame, cartDownloadBtn, cartFileUpload, cartUploadBtn },
} = require("../constant");
const { pathUpload } = require("../config");
const { logToFile, timeCalc } = require("../utils");

module.exports = {
  uploadDownload: async (page, options) => {
    const start = performance.now();
    let testCase = "";
    await page.waitForSelector(cartIFrame, { visible: true });

    // Ambil handle ke choosefile
    const iframeHandle = await page.$(cartIFrame);
    const iframeContent = await iframeHandle.contentFrame();

    // Klik tombol input di dalam iframe
    if (options === "DOWNLOAD") {
      await iframeContent.click(cartDownloadBtn);
      testCase = "Click Button Download";
      logToFile("Klik Tombol Download");
    }

    if (options === "UPLOAD") {
      const filePath = path.relative(process.cwd(), pathUpload);
      const inputUploadHandle = await iframeContent.$(cartFileUpload);
      await inputUploadHandle.uploadFile(filePath);

      logToFile("File has been selected for upload");

      await iframeContent.waitForSelector(cartUploadBtn);
      await iframeContent.click(cartUploadBtn);

      testCase = "Click Button Upload";
      logToFile("Klik Tombol Upload");
    }
    const end = performance.now();

    return {
      testCase,
      duration: await timeCalc(end, start),
      isTestCaseSuccess: true,
    };
  },
};
