// Fungsi untuk mengevaluasi XPath di dalam halaman
const fs = require("fs");
const path = require("path");
const moment = require("moment");
const puppeteer = require("puppeteer");
const pdf = require("html-pdf");

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

// const generatePdf = async (page) => {
//   // Read the HTML file
//   const htmlFilePath = path.join(__dirname, "report.html");
//   const htmlContent = fs.readFileSync(htmlFilePath, "utf8");
//   await page.setContent(htmlContent, { waitUntil: "networkidle0" });

//   // Get today's date as a string using Moment.js
//   const dateString = moment().format("YYYY-MM-DD");

//   // Define the output directory and file name
//   const outputDir = path.join(__dirname, dateString);
//   const pdfOutputPath = path.join(outputDir, "test-result.pdf");

//   // Ensure the output directory exists
//   if (!fs.existsSync(outputDir)) {
//     fs.mkdirSync(outputDir);
//   }

//   console.log("sampai sini gak sih");
//   // Generate a PDF and save it to the specified path
//   await page.pdf({
//     path: pdfOutputPath,
//     format: "A4",
//     printBackground: true,
//   });

//   // Close the browser
//   await browser.close();
//   // Read the current script file
//   console.log(`PDF saved to ${pdfOutputPath}`);
// };

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

const BASE_DIRECTORY = "D:/ProjectME/puppeteer-b2b/document/";

const generatePdf = async (content) => {
  // Save HTML content to a file

  // console.log('kupon:',couponUsed[0]);
  // console.log('point:',pointAmount);

  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: false,
    args: ["--start-maximized"],
  });
  const page = await browser.newPage();

  // Read HTML content from file and convert to PDF
  let htmlFilePath = "";
  let pdfFilePath = "";

  // await fs.promises.writeFile('../html/page1.html', content);
  await fs.promises.writeFile(BASE_DIRECTORY + "page.html", content);
  // htmlFilePath = BASE_DIRECTORY + "page1.html";

  // pdfFilePath = 'document/pdf-download-page1-' + currentDate.replace(/-/g, '') +'T'+ new Date().getHours() + new Date().getMinutes() +new Date().getSeconds()+'.pdf';
  // let couponName =
  //   couponUsed[0] === "" ? "-Tidak Menggunakan Kupon" : "-kupon=" + couponUsed;
  // let pointUsed =
  //   pointAmount === "" ? "-Tidak Menggunakan Poin" : "-poin=" + pointAmount;

  const currentDate = moment().format("YYYY-MM-DD");
  const currentDateSec = moment().format("YYYYMMDD-HHmmss");

  let folderLocator = BASE_DIRECTORY + currentDate;
  console.log("folder", folderLocator);
  fs.access(folderLocator, function (err) {
    if (err && err.code === "ENOENT") {
      fs.mkdir(folderLocator, { recursive: true }, (err) => {
        if (err) throw err;
      });
    }
  });

  pdfFilePath =
    folderLocator + "/" + "Testing-B2B-" + currentDateSec + ".pdf";

  console.log("pdfFilePath", pdfFilePath);
  await page.setContent(content, {
    waitUntil: "networkidle0",
  });

  // await page.pdf({
  //   path: pdfFilePath,
  //   format: "A4",
  //   printBackground: true,
  //   displayHeaderFooter: true,
  //   headerTemplate: contentHeader,
  //   footerTemplate: contentFooter,
  //   margin: {
  //     top: "30px",
  //     bottom: "40px",
  //   },
  // });

  pdf.create(content).toFile(pdfFilePath, (err, res) => {
    if (err) return console.error(err);
    console.log(`PDF generated at ${pdfFilePath}`);
  });
  console.log("PDF file has been generated!");
  // await browser.close();
  // console.log(pdfFilePath)
  return pdfFilePath;
};

module.exports = {
  clickElementByXPath,
  capitalizeArrayItems,
  timeCalc,
  dateDifference,
  waiting,
  generatePdf,
};
