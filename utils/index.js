const fs = require("fs");
const fsprom = require("fs").promises;

const path = require("path");
const moment = require("moment");
const winston = require("winston");
const { format } = require("winston");
const pdf = require("html-pdf");
const { BASE_DIRECTORY } = require("../config");
const { combine, timestamp, printf } = format;

const localTimestamp = timestamp({
  format: () =>
    new Date().toLocaleString("id-ID", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }),
});

const clickElementByXPath = async (xpath) => {
  const elements = document.evaluate(
    xpath,
    document,
    null,
    XPathResult.ANY_TYPE,
    null
  );
  const element = elements.iterateNext();
  if (element) {
    element.click();
    return true;
  }
  return false;
};

// const capitalizeArrayItems = (item) => {
//   const words = item.split("_");
//   return words
//     .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
//     .join(" ");
// };

const capitalizeArrayItems = (item) =>
  item
    .split("_")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");

const timeCalc = async (end, start) => {
  let diff = (end - start) / 1000;
  return diff.toFixed(2);
};

const dateDifference = async (end, start) => {
  let diff = end - start;
  let minutes = Math.floor(diff / 60000);
  let seconds = ((diff % 60000) / 1000).toFixed(0);

  return `${minutes} minutes and ${seconds} seconds`;
};

const waiting = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const waitSelectorAdmin = async (page, selectorMenu, textSelector) => {
  await page.waitForSelector(selectorMenu);
  await page.evaluate(
    (selectorMenu, textSelector) => {
      const menuItems = [...document.querySelectorAll(selectorMenu)].find(
        (item) => item.innerText.includes(textSelector)
      );
      if (menuItems) menuItems.click();
    },
    selectorMenu,
    textSelector
  );
};

const getCurrentDate = (opt) =>
  opt === "s" ? moment().format("YYYYMMDDHHmm") : moment().format("YYYY-MM-DD");

const logToFile = (message) => {
  const baseFolder = path.join(__dirname, "..", "logs");
  const currentTimeInText = moment().format("YYYY-MM-DD HH:mm:ss");
  const dateFolder = path.join(baseFolder, getCurrentDate());
  const logFile = path.join(dateFolder, `${getCurrentDate("s")}.txt`);

  // Buat folder logs jika belum ada
  if (!fs.existsSync(baseFolder)) {
    fs.mkdirSync(baseFolder, { recursive: true });
  }

  // Buat folder dengan nama tanggal jika belum ada
  if (!fs.existsSync(dateFolder)) {
    fs.mkdirSync(dateFolder, { recursive: true });
  }

  const logMessage = `${currentTimeInText}: ${message}`;
  fs.appendFile(logFile, logMessage + "\n", (err) => {
    if (err) throw err;
  });

  console.log(currentTimeInText + ": " + message);
};

const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${level}: ${timestamp} ${message}`;
});

const logger = winston.createLogger({
  //level: "info", // Tingkat log minimal yang dicatat
  //format: winston.format.simple(), // Format log sederhana
  format: combine(localTimestamp, myFormat),
  transports: [
    new winston.transports.Console(), // Catatan log ke konsol
    new winston.transports.File({ filename: "app.log" }), // Catatan log ke file 'app.log'
  ],
});

// Format log
const logFormat = printf(({ level, message, timestamp }) => {
  const formattedDate = new Date().getTime();
  return `${formattedDate} | ${level.toUpperCase()} | ${message}`;
});

const getHtmlData = async (testCase, startDate, endDate, duration) => {
  const templatePath = path.join(__dirname, "../template/report.html");
  const cssFilePath = path.join(__dirname, "../styles", "styles.css");
  const cssContent = await fsprom.readFile(cssFilePath, "utf8");
  const head = `
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=2.0">
   <script src="https://kit.fontawesome.com/a076d05399.js" crossorigin="anonymous"></script>
   <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.0.7/css/all.css">  
   <title>Automation Testing</title>
   <style>${cssContent}</style>`;

  let htmlResult = fs.readFileSync(templatePath, "utf-8");
  htmlResult = htmlResult.replace("{{reporthead}}", head);
  htmlResult = htmlResult.replace("{{startDate}}", startDate);
  htmlResult = htmlResult.replace("{{endDate}}", endDate);
  htmlResult = htmlResult.replace("{{duration}}", duration);

  // Panggil fungsi untuk memetakan data ke dalam HTML
  const htmlReport = convertDataToHTML(testCase);
  htmlResult = htmlResult.replace("{{rows}}", htmlReport);

  fs.writeFileSync("test-report.html", htmlResult, "utf8");

  console.log("HTML test report has been generated!");
  return htmlResult;
};

// Fungsi untuk mapping data ke dalam format HTML
const convertDataToHTML = (data) => {
  let testNameIndex = 1; // Inisialisasi nomor urut untuk testName
  let htmlContent = "";

  Object.keys(data).forEach((testName) => {
    let testCaseIndex = 1; // Inisialisasi nomor urut untuk testCase dalam setiap testName
    const testCaseCount = data[testName].length; // Hitung jumlah testCase dalam satu testName

    // Loop untuk setiap testCase dalam testName
    data[testName].forEach((testCaseObj, index) => {
      htmlContent += "<tr>";

      // Hanya cetak testName di baris pertama, lalu gunakan rowspan untuk menggabungkan sel
      if (index === 0) {
        htmlContent += `<td class='left-align' rowspan="${testCaseCount}">
        ${testNameIndex}. ${capitalizeArrayItems(testName)}</td>`;
      }

      htmlContent += `
          <td class='left-align'>${testCaseIndex}. ${testCaseObj.testCase}</td>
          <td><i>${testCaseObj.duration}s</i></td>
          <td><span class="${
            testCaseObj.isTestCaseSuccess ? "status-pass" : "status-fail"
          }">
            ${testCaseObj.isTestCaseSuccess ? "PASS" : "FAIL"}
          </td>
        </tr>`;

      testCaseIndex++;
    });

    testNameIndex++; // Tambah nomor urut untuk testName berikutnya
  });
  return htmlContent;
};

const generatePDF = (htmlResult) => {
  const folderLocator = BASE_DIRECTORY + getCurrentDate();
  const pdfFilePath =
    folderLocator + "/" + "Testing-B2B-" + getCurrentDate("s") + ".pdf";

  // const opt = { format: "Letter" };
  // Konfigurasi PDF
  const opt = {
    format: "A4",
    border: "10mm",
    type: "pdf",
  };
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

module.exports = {
  clickElementByXPath,
  capitalizeArrayItems,
  timeCalc,
  dateDifference,
  waiting,
  logToFile,
  waitSelectorAdmin,
  getHtmlData,
  generatePDF,
  logger,
};
