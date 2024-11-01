const { capitalizeArrayItems } = require(".");
const path = require("path");
const fs = require("fs");
const fsprom = require("fs").promises;

const first = async (startTime, endTime, diffTime) => {
  let start = "";
  start += `
        <!DOCTYPE html>
        <html xmlns="http://www.w3.org/1999/xhtml">
        
        <head>
           <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
           <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=2.0">
           <script src="https://kit.fontawesome.com/a076d05399.js" crossorigin="anonymous"></script>
           <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.0.7/css/all.css">
           <title>Automation Testing Result</title>
        </head>
        <style>
           @media print {
              .pagebreak {
                 page-break-after: always;
              }
        
              /* page-break-after works, as well */
           }
        
           body {
              margin: 25px;
              padding: 0;
              color: #333;
              font-style: normal;
              font-family: 'Open Sans', sans-serif;
              text-align: left;
              background-color: white;
           }
        
           table,
           validation,
           summary {
              border-collapse: collapse;
              width: 100%;
           }
        
           .detail,
           .flow {
              font-size: 12px;
              padding-top: 5px;
           }
        
           .flow td {
              padding-left: 5px;
              padding-right: 5px;
        
           }
        
           .detail th {
              font-size: 12px;
              color: #333;
              padding-left: 5px;
           }
        
           .detail td {
              text-indent: -5px;
              padding-left: 10px;
              padding-right: 5px;
        
           }
        
           .validation td {
              text-align: center;
              border: 1px solid lightgrey
           }
        
           .summary td {
              font-size: 12px;
              vertical-align: top;
              padding-left: 5px;
           }
        
           .summary i {
              font-size: 1.5em;
           }
        
           .detail td,
           .flow td,
           .validation td {
              vertical-align: top;
           }
        
           .validation th,
           .summary th {
              font-size: 12px;
              text-align: center;
              background-color: lightgrey;
              padding: 2px;
              width: 33%;
              border: 1px solid lightgrey
           }
        
           .summary th {
              padding-left: 5px;
           }
        
           .fa-minus {
              color: gold
           }
        
           .fa-times {
              color: red;
           }
        
           .fa-check {
              color: green;
           }
        </style>
        
        <body>
           <tbody>
              <!-- image-->
              <div>
                 <tr>
                    <td>
                       <img align="right" src="https://storageb2cprod.blob.core.windows.net/asset-b2c-prod/aop/logo-aop.png"
                          alt="Astra Oto Shop" style="border:0;height:auto;line-height:100%;outline:none;text-decoration:none"
                          width="140px" height="52" border="0">
                    </td>
                 </tr>
              </div>
              <!-- report-->
              <div class="pagebreak">
                 <tr>
                    <td>
                       <!-- summary -->
                       <div class="detail">
                          <p> The following is your automation test result summary: <br></p>
                          <table>
                             <tr>
                                <td style="width: 10%;">Start Date</td>
                                <td>: ${startTime} </td>
                             </tr>
                             <tr>
                                <td>End Date</td>
                                <td>: ${endTime} </td>
                             </tr>
                             <tr>
                                <td>Duration</td>
                                <td>: ${diffTime} </td>
                             </tr>
                          </table>
                       </div>
                       <!-- recap -->
                       <div style="padding-top: 10px;">
                          <table class="summary" style="border: 4px solid rgb(234, 234, 234);">
                             <thead>
                                <tr>
                                   <th style="width: 50%;text-align: left;">Scenario</th>
                                   <th colspan="2" style="width: 40%;text-align: left;">Process</th>
                                   <th style="width: 10%;text-align: center;">Execution Time</th>
                                </tr>
                             </thead>
                             <tbody>
    `;
  return start;
};

const summaryEnd = `
                     </tbody>
                  </table>
               </div>
            </td>
         </tr>
      </div>
`;

const getSummary = async (testCase, start, end, duration) => {
  let body = "";
  const firstHtml = await first(start, end, diff);
  const keys = Object.keys(testCase);

  //   const loginCase = ["Login Failed", "Login Success"]; // hanya contoh
  //   for (let i = 0; i < keys.length; i++) {
  keys.forEach((key, i) => {
    const testName = testCase[key];
    const keysLength = testName.length;

    body += `
           <tr>
           <td rowspan="${keysLength}" style="border-bottom: 1px solid rgb(234, 234, 234);">
              <a href="#scenario-${i + 1}"><b>#${
      i + 1
    } </b> ${capitalizeArrayItems(key)}</a>
           </td>`;

    for (let j = 0; j < keysLength; j++) {
      const lastIndex = keysLength - 1;
      body += `<td style="${
        j === 0
          ? "width: 20%;"
          : j === lastIndex
          ? "border-bottom: 1px solid rgb(234, 234, 234);"
          : ""
      }">${j + 1}. ${testName[j].testCase}</td>
              <td style="text-align: center; ${
                j === lastIndex
                  ? "border-bottom: 1px solid rgb(234, 234, 234);"
                  : ""
              }">${
        testName[j].isTestCaseSuccess === true
          ? '<i class="fas fa-check"></i>'
          : '<i class="fas fa-times"></i>'
      }</td>
              <td style="text-align: center;font-size: 6px;${
                j === lastIndex
                  ? "border-bottom: 1px solid rgb(234, 234, 234);"
                  : ""
              }"><i>${testName[j].duration} s</i></td>
              </tr>`;
    }
  });

  let summaryHtml = firstHtml + body + summaryEnd;
  return summaryHtml;
};

const detailHtml = async (custOrderDetail) => {
  let body = "";
  for (let i = 0; i < custOrderDetail.length; i++) {
    body += `
        <div class="pagebreak">
            <table class="flow">
               <tr>
                  <td colspan="4" style="font-size:14px;padding-bottom: 10px; padding-top:20px">
                     <b id="scenario-${i + 1}">SCENARIO ${i + 1} </b><br>
                  </td>
               </tr>
               <tr>
                  <td colspan="4">
                     - Melakukan order produk <b><i>${
                       custOrderDetail[i].productType
                     }</i></b> <br>
                     - Melakukan pembatalan order : <b><i>${
                       custOrderDetail[i].paymentMethod.includes("VA")
                         ? "Klik Batalkan Pesanan"
                         : custOrderDetail[i].paymentMethod.includes("Alfa")
                         ? "Klik Batalkan Pesanan"
                         : custOrderDetail[i].paymentMethod.includes("Credit")
                         ? "Klik Back CC Page"
                         : "Batalkan via Admin"
                     }</i></b>
                  </td>
               </tr>
               <tr>
                  <td colspan="4" style="font-size:14px; text-align: right;">
                     <b>#${custOrderDetail[i].orderNumber}</b>
                  </td>
               </tr>
               <tr>
                  <td colspan="4" style="font-size:9px; text-align: right; ">
                     Order date: ${custOrderDetail[i].orderDate}
                  </td>
               </tr>
            </table>
            <table class="detail">
               <!-- get location -->
               <div>
                  <tr>
                     <th colspan="4">${
                       custOrderDetail[i].productType === "Layanan Bengkel"
                         ? "Get Location"
                         : ""
                     }</th>
                  </tr>
                  <tr>
                     <td style="width:12%">${
                       custOrderDetail[i].productType === "Layanan Bengkel"
                         ? "Latitude"
                         : ""
                     }</td>
                     <td colspan="3">${
                       custOrderDetail[i].productType === "Layanan Bengkel"
                         ? ": " + custOrderDetail[i].location.latitude
                         : ""
                     }</td>
                  </tr>
                  <tr>
                     <td>${
                       custOrderDetail[i].productType === "Layanan Bengkel"
                         ? "Longitude"
                         : ""
                     }</td>
                     <td colspan="3"> ${
                       custOrderDetail[i].productType === "Layanan Bengkel"
                         ? ": " + custOrderDetail[i].location.longitude
                         : ""
                     }</td>
                  </tr>
                  <tr>
                     <td>${
                       custOrderDetail[i].productType === "Layanan Bengkel"
                         ? "Nearest Place"
                         : ""
                     }</td>
                     <td colspan="3">${
                       custOrderDetail[i].productType === "Layanan Bengkel"
                         ? ": " +
                           custOrderDetail[i].location.getLocationResponse.data
                             .subDistrictName +
                           ", Kec. " +
                           custOrderDetail[i].location.getLocationResponse.data
                             .districtName +
                           ", " +
                           custOrderDetail[i].location.getLocationResponse.data
                             .cityName
                         : ""
                     }</td>
                  </tr>
               </div>
               <!-- customer & order -->
               <div>
                  <tr>
                     <th colspan="2">Customer Information</th>
                  </tr>
                  <tr>
                     <td style="width:12%">Name</td>
                     <td style="width:40%">: ${
                       custOrderDetail[i].receiverName
                     }</td>
                  </tr>
                  <tr>
                     <td>Phone</td>
                     <td>: ${custOrderDetail[i].receiverPhone}</td>
                  </tr>
                  <tr>
                     <td> ${
                       custOrderDetail[i].productType != "Layanan Bengkel"
                         ? "Address"
                         : ""
                     }</td>
                     <td colspan="3">${
                       custOrderDetail[i].productType != "Layanan Bengkel"
                         ? ": " + custOrderDetail[i].address
                         : ""
                     }</td>
                  </tr>
               </div>
               <!-- product -->
               <div>
                  <tr>
                     <th colspan="2">Product Detail</th>
                  </tr>
                  <tr>
                     <td>SKU</td>
                     <td colspan="3">: ${custOrderDetail[i].productSKU}</td>
                  </tr>
                  <tr>
                     <td>Name</td>
                     <td colspan="3">: ${custOrderDetail[i].productName}</td>
                  </tr>
                  <tr>
                     <td>Price</td>
                     <td colspan="3">: ${custOrderDetail[i].productPrice}</td>
                  </tr>
                  <tr>
                     <td>${
                       custOrderDetail[i].productType === "Layanan Bengkel"
                         ? "Merchant"
                         : ""
                     }</td>
                     <td> ${
                       custOrderDetail[i].productType === "Layanan Bengkel"
                         ? ": " + custOrderDetail[i].productOutlet
                         : ""
                     }</td>
                  </tr>
               </div>
               <!-- coupon & point -->
               <div>
                  <tr>
                     <th colspan="2">Coupon & Point Usage</th>
                  </tr>
                  <tr>
                     <td>Coupon Code</td>
                     <td colspan="3">: ${custOrderDetail[i].usedCoupon} ( <i>${
      custOrderDetail[i].useCouponStatus
    }</i> )</td>
                  </tr>
                  <tr>
                     <td>Point</td>
                     <td colspan="3">: ${custOrderDetail[i].usedPoint} ( <i>${
      custOrderDetail[i].applyPoint.message === "Tidak Menggunakan Poin"
        ? "Tidak Menggunakan Poin"
        : custOrderDetail[i].applyPoint.message.includes(
            "Tidak memenuhi syarat, minimal pembelanjaan"
          )
        ? custOrderDetail[i].applyPoint.message
        : "Successfully apply point"
    }</i> )</td>
                  </tr>
               </div>
               <!-- order-->
               <div>
                  <tr>
                     <th colspan="4">Order Detail</th>
                  </tr>
                  <tr>
                     <td>Quantity</td>
                     <td>: ${custOrderDetail[i].qty}</td>
                  </tr>
                  <tr>
                     <td>Payment Method</td>
                     <td>: ${custOrderDetail[i].paymentMethod}</td>
                  </tr>
                  <tr>
                     <td>${
                       custOrderDetail[i].productType === "Suku Cadang"
                         ? "Shipment Method"
                         : ""
                     }</td>
                     <td>${
                       custOrderDetail[i].courier ===
                       "It is not spareparts order"
                         ? ""
                         : ": " + custOrderDetail[i].courier
                     }</td>
                  </tr>
                  <tr>
                     <td colspan="4" style="padding-top: 25px; text-align: right;">
                        <table>
                           <tr>
                              <td colspan="2" style="width: 50%;"></td>
                              <td style="text-align: left">Subtotal</td>
                              <td>${
                                custOrderDetail[i].qty *
                                custOrderDetail[i].productPrice
                              }</td>
                           </tr>
                           <tr>
                              <td colspan="2"></td>
                              <td style="text-align: left">${
                                custOrderDetail[i].applyPoint.message ===
                                "Tidak Menggunakan Poin"
                                  ? ""
                                  : custOrderDetail[
                                      i
                                    ].applyPoint.message.includes(
                                      "Tidak memenuhi syarat"
                                    )
                                  ? ""
                                  : "Point"
                              }</td>
                              <td>${
                                custOrderDetail[i].applyPoint.message ===
                                "Tidak Menggunakan Poin"
                                  ? ""
                                  : custOrderDetail[
                                      i
                                    ].applyPoint.message.includes(
                                      "Tidak memenuhi syarat"
                                    )
                                  ? ""
                                  : "- " +
                                    custOrderDetail[i].applyPoint.data.point
                              }</td>
                           </tr>
                           <tr>
                              <td colspan="2"></td>
                              <td style="text-align: left">${
                                custOrderDetail[i].useCouponData != ""
                                  ? custOrderDetail[i].useCouponData !=
                                    "Tidak menggunakan kupon"
                                    ? "Coupon Disc."
                                    : ""
                                  : ""
                              }</td>
                              <td>${
                                custOrderDetail[i].useCouponData != ""
                                  ? custOrderDetail[i].useCouponData !=
                                    "Tidak menggunakan kupon"
                                    ? "- " +
                                      custOrderDetail[
                                        i
                                      ].useCouponData.discount_amount.replace(
                                        ".00000",
                                        ""
                                      )
                                    : ""
                                  : ""
                              }</td>
                           </tr>
                           <tr>
                              <td colspan="2"></td>
                              <td style="text-align: left">${
                                custOrderDetail[i].productType === "Suku Cadang"
                                  ? "Shipment Fee"
                                  : ""
                              }</td>
                              <td> ${
                                custOrderDetail[i].productType === "Suku Cadang"
                                  ? custOrderDetail[i].shippingFee[1].value
                                  : ""
                              }</td>
                           </tr>
                           <tr>
                              <td colspan="2"></td>
                              <td style="text-align: left">${
                                custOrderDetail[i].productType === "Suku Cadang"
                                  ? "Shipment Disc."
                                  : ""
                              }</td>
                              <td>${
                                custOrderDetail[i].productType === "Suku Cadang"
                                  ? custOrderDetail[i].shippingFee[2].value
                                  : ""
                              }</td>
                           </tr>
                           <tr>
                              <td colspan="2"></td>
                              <td style="text-align: left;border-top: 1px solid grey"><b>Grand Total</b></td>
                              <td style="border-top: 1px solid grey">${
                                custOrderDetail[i].total
                              }</td>
                           </tr>
                        </table>
                     </td>
                  </tr>
               </div>
               <!-- validation-->
               <div>
                  <tr>
                     <th colspan="4">Validation</th>
                  </tr>
                  <tr>
                     <td colspan="4" style="padding-left: 20px;">
                        Point
                     </td>
                  </tr>
                  <tr>
                     <td colspan="4">
                        <table class="validation">
                           <th>Before Order</th>
                           <th>After Order</th>
                           <th>After Cancel</th>
                           <tr>
                              <td>${custOrderDetail[i].balancePoint}</td>
                              <td>${custOrderDetail[i].poinAfterOrder}</td>
                              <td>${custOrderDetail[i].pointAfterCancel}</td>
                           </tr>
                        </table>
                     </td>
                  </tr>
                  <tr>
                     <td colspan="4" style="padding-left: 20px;">
                        Stock (QTY)
                     </td>
                  </tr>
                  <tr>
                     <td colspan="4">
                        <table class="validation">
                           <th>Before Order</th>
                           <th>After Order</th>
                           <th>After Cancel</th>
                           <tr>
                                <td>${
                                  custOrderDetail[i].initTotalAvailOutlet ===
                                    "It is not product service order" ||
                                  custOrderDetail[i].initTotalAvailOutlet === ""
                                    ? custOrderDetail[i].initAvailQty
                                    : custOrderDetail[i].initTotalAvailOutlet
                                }</td>
                                <td>${
                                  custOrderDetail[i]
                                    .afterOrderTotalAvailOutlet ===
                                    "It is not product service order" ||
                                  custOrderDetail[i]
                                    .afterOrderTotalAvailOutlet === ""
                                    ? custOrderDetail[i].afterOrderTotalAvail
                                    : custOrderDetail[i]
                                        .afterOrderTotalAvailOutlet
                                }</td>
                                <td>${
                                  custOrderDetail[i]
                                    .afterCancelTotalAvailOutlet ===
                                    "It is not product service order" ||
                                  custOrderDetail[i]
                                    .afterCancelTotalAvailOutlet === ""
                                    ? custOrderDetail[i].afterCancelTotalAvail
                                    : custOrderDetail[i]
                                        .afterCancelTotalAvailOutlet
                                }</td>
                           </tr>
                        </table>
                     </td>
                  </tr>
               </div>
            </table>
         </div>
    `;
  }
  let recapHtml = body + endHtml;
  console.log("page2 ok");

  return recapHtml;
};

const endHtml = `
   </tbody>
   <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js"></script>
   <script type="text/javascript" src="js/fullpage.js"></script>
   <script type="text/javascript" src="js/examples.js"></script>
</body>

</html>
`;

const getHtmlData = async (testCase, startDate, endDate, duration) => {
  //   let section1 = await getSummary(testCase, start, end, diff);
  //   const keys = Object.keys(testCase);
  //   console.log('keys')
  //   console.log(keys)
  //   const rows = keys.forEach((key, index) => {
  //     const testName = testCase[key];
  //     const keysLength = testName.length;
  //     return `
  //       <tr>
  //     <td>${index + 1}. ${key.testCase}</td>
  //     <td>${testName
  //       .map((step, stepIndex) => `${stepIndex + 1}. ${step}`)
  //       .join("<br>")}</td>
  //                 <td class="center">
  //                 <span class="success">&#10004;</span>
  //               </td>
  //               <td class="center">2s</td>
  //     </tr>
  //     `;
  //   });
  //  .join("");

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

module.exports = { getHtmlData };
