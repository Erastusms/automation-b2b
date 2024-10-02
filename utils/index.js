const fs = require('fs');
const path = require('path');
const moment = require("moment");

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

const contentHeader = `
   <span style="font-size: 10px;padding-left : 15px"><i>
         This is a custom PDF for Automation Test Result
       <span>B2C AstraOtoshop</span> (<span> https://astraotoshop.com </span>)</i>
   </span>
   `;

const contentFooter = `
        <span style="font-size: 10px;padding-left : 15px"><i>
            Generated on: <span class="date"></span><br/>
            Page <span class="pageNumber"></span> of <span class="totalPages "></span>
        </span>
        `;

const logToFile = (message) => {
  const baseFolder = path.join(__dirname, '..', 'logs'); // Folder 'logs' di dalam 'automation-b2b'
  const currentDate = moment().format('DD-MM-YYYY'); // Format tanggal dengan moment
  const currentTime = moment().format('YYYYMMDDHHmm'); // Format waktu dengan moment
  const currentTimeInText = moment().format('YYYY-MM-DD HH:mm:ss'); // Format waktu dengan moment
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

  const logMessage = `${currentTimeInText}: ${message}`;  // Tulis pesan log ke file
  fs.appendFile(logFile, logMessage + '\n', (err) => {
    if (err) throw err;
  });

  // Cetak log ke console juga
  console.log(currentTimeInText + ": " + message);
}

module.exports = {
  clickElementByXPath,
  capitalizeArrayItems,
  timeCalc,
  dateDifference,
  waiting,
  logToFile
};
