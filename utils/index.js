require("dotenv").config();
const fs = require("fs");
const path = require("path");
const moment = require("moment");
const pdf = require("html-pdf");
const nodemailer = require("nodemailer");
const BASE_DIRECTORY = "D:/ProjectME/puppeteer-b2b/document/";
const currentDate = moment().format("YYYY-MM-DD");
const currentDateSec = moment().format("YYYYMMDD-HHmmss");
const folderLocator = BASE_DIRECTORY + currentDate;
const pdfFilePath = folderLocator + "/" + "Testing-B2B-" + currentDateSec + ".pdf";

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
        console.log("PDF berhasil dibuat: " + res.filename);
        resolve(res.filename);
      }
    });
  });
};

// Main function untuk menggenerate PDF lalu mengirim email
// Fungsi untuk mengirim email setelah PDF selesai dibuat
const sendEmail = (pdfFilePath) => {
  // Konfigurasi transporter email
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Detail email
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_TO,
    // cc: "app-portal.b2b@component.astra.co.id",
    subject: `Testing B2B - ${currentDate}`,
    text: `Testing B2B yang dilakukan pada ${currentDate} dengan report pada lampiran`,
    attachments: [
      {
        filename: path.basename(pdfFilePath),
        path: pdfFilePath, // Lampirkan file PDF yang telah di-generate
      },
    ],
  };

  // Kirim email
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error("Gagal mengirim email:", err);
    } else {
      console.log("Email berhasil dikirim:", info.response);
    }
  });
};

// Main function untuk menggenerate PDF lalu mengirim email
const sendEmailWithPDF = (htmlResult) => {
  generatePDF(htmlResult)
    .then((pdfFilePath) => {
      // Setelah PDF berhasil dibuat, kirim email dengan lampiran PDF
      sendEmail(pdfFilePath);
    })
    .catch((err) => {
      console.error("Terjadi kesalahan:", err);
    });
};

module.exports = {
  clickElementByXPath,
  capitalizeArrayItems,
  timeCalc,
  dateDifference,
  waiting,
  sendEmailWithPDF,
};
