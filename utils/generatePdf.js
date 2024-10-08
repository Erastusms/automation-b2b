const fs = require("fs");
const moment = require("moment");
const pdf = require("html-pdf");
const { BASE_DIRECTORY } = require("../config");
const { logToFile } = require(".");

const currentDate = moment().format("YYYY-MM-DD");
const currentDateSec = moment().format("YYYYMMDD-HHmmss");
const folderLocator = BASE_DIRECTORY + currentDate;
const pdfFilePath =
  folderLocator + "/" + "Testing-B2B-" + currentDateSec + ".pdf";

const generatePDF = (htmlResult) => {
  const opt = { format: "Letter" };
  console.log("folder", folderLocator);
  fs.access(folderLocator, function (err) {
    if (err && err.code === "ENOENT") {
      fs.mkdir(folderLocator, { recursive: true }, (err) => {
        if (err) throw err;
      });
    }
  });

  return new Promise((resolve, reject) => {
    pdf.create(htmlResult, opt).toFile(pdfFilePath, (err, res) => {
      if (err) {
        reject(err);
      } else {
        logToFile(`PDF berhasil dibuat: ${res.filename}`);
        resolve(res.filename);
      }
    });
  });
};

module.exports = { generatePDF };
