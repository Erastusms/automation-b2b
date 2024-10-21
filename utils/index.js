const fs = require("fs");
const path = require("path");
const moment = require("moment");
const winston = require("winston");
const { format } = require("winston");
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

const capitalizeArrayItems = (item) => {
  // return arr.map((item) => {
  const words = item.split("_");
  return words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  // });
};

const timeCalc = async (end, start) => {
  let diff = (end - start) / 1000;
  let roundDiff = diff.toFixed(2);

  return roundDiff;
};

const dateDifference = async (end, start) => {
  let diff = end - start;
  let minutes = Math.floor(diff / 60000);
  let seconds = ((diff % 60000) / 1000).toFixed(0);

  let result = `${minutes} minutes and ${seconds} seconds`;
  return result;
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

const logToFile = (message) => {
  const baseFolder = path.join(__dirname, "..", "logs"); // Folder 'logs' di dalam 'automation-b2b'
  const currentDate = moment().format("DD-MM-YYYY"); // Format tanggal dengan moment
  const currentTime = moment().format("YYYYMMDDHHmm"); // Format waktu dengan moment
  const currentTimeInText = moment().format("YYYY-MM-DD HH:mm:ss"); // Format waktu dengan moment
  const dateFolder = path.join(baseFolder, currentDate); // Subfolder dengan nama tanggal
  const logFile = path.join(dateFolder, `${currentTime}.txt`); // File dengan nama waktu (hh-mm-ss.txt)

  // Buat folder logs jika belum ada
  if (!fs.existsSync(baseFolder)) {
    fs.mkdirSync(baseFolder, { recursive: true });
  }

  // Buat folder dengan nama tanggal jika belum ada
  if (!fs.existsSync(dateFolder)) {
    fs.mkdirSync(dateFolder, { recursive: true });
  }

  const logMessage = `${currentTimeInText}: ${message}`; // Tulis pesan log ke file
  fs.appendFile(logFile, logMessage + "\n", (err) => {
    if (err) throw err;
  });

  // Cetak log ke console juga
  console.log(currentTimeInText + ": " + message);
};
//let logdatetime =moment().format("YYYY-MM-DD HH:mm:ss")
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

module.exports = {
  clickElementByXPath,
  capitalizeArrayItems,
  timeCalc,
  dateDifference,
  waiting,
  logToFile,
  waitSelectorAdmin,
  logger,
};
