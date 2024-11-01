const fs = require("fs");
const path = require("path");
const {
  scrollElement,
  cart,
  checkSuspend,
  uploadDownload,
} = require("../components");
const {
  selectorList: {
    cartIcon,
    cartAddItem,
    cartUseVoucher1,
    cartUseVoucher6,
    cartSelectVoucher,
    cartTextPartNumber,
    cartTxtQuantity,
    cartTextSearchVoucher,
    cartInputVoucher,
    cartSearchVoucherBtn,
  },
  cartData,
  cartDataWithVoucher,
} = require("../constant");
const { waiting, timeCalc, logToFile } = require("../utils");
const { pathDownload, pathUpload } = require("../config");
const { adminPage } = require("./adminPage");

const dataCart = [cartData, cartDataWithVoucher];

const cartPage = async (page) => {
  const cart_page = [];
  let isTestCaseSuccess = true;
  let isFromHomePage = true;
  try {
    const open_cart_page = await cart(page, isFromHomePage);
    cart_page.push(open_cart_page);

    await waiting(1000);

    const isCustomerSuspend = await checkSuspend(page);
    console.log("customer kena suspend gak? " + isCustomerSuspend);
    if (isCustomerSuspend) {
      isFromHomePage = false;
      await adminPage(page);
      await cart(page, isFromHomePage);
    }

    // pada halaman cart
    logToFile("Masuk halaman cart");

    // Tentukan folder tempat file akan diunduh
    const downloadPath = path.resolve(pathDownload);
    fs.mkdirSync(downloadPath, { recursive: true });

    // Mengatur perilaku download untuk menyimpan file di folder yang ditentukan
    await page._client().send("Page.setDownloadBehavior", {
      behavior: "allow",
      downloadPath: downloadPath,
    });

    page.on("dialog", async (dialog) => {
      await waiting(1000);
      await dialog.accept(); // Klik tombol "OK" di dialog alert
    });

    const downloadBtn = await uploadDownload(page, "DOWNLOAD");
    cart_page.push(downloadBtn);

    await waiting(1000);

    const uploadBtn = await uploadDownload(page, "UPLOAD");
    cart_page.push(uploadBtn);

    let start = performance.now();
    await waiting(2000);

    const btnSelectVoucher = await page.waitForSelector(cartSelectVoucher, {
      visible: true,
    });

    const scrollBtnLihatVoucher = await scrollElement(
      start,
      page,
      cartSelectVoucher
    );

    cart_page.push(scrollBtnLihatVoucher);

    start = performance.now();
    await btnSelectVoucher.click();
    await waiting(1000);
    end = performance.now();

    start = performance.now();
    await page.type(cartTextSearchVoucher, cartInputVoucher);
    const searchVoucherBTN = await page.waitForSelector(cartSearchVoucherBtn, {
      visible: true,
    });
    await searchVoucherBTN.click();
    await waiting(1000);

    const cartUseVoucherSelector = await page.waitForSelector(cartUseVoucher1, {
      visible: true,
    });
    end = performance.now();

    const selectVoucher = {
      testCase: "Select and Use Voucher",
      duration: await timeCalc(end, start),
      isTestCaseSuccess,
    };

    cart_page.push(selectVoucher);

    const scrollSelector = await scrollElement(start, page, cartUseVoucher1);
    cart_page.push(scrollSelector);

    await waiting(1000);

    start = performance.now();
    await cartUseVoucherSelector.click();
    await waiting(1000);
    // end = performance.now();
    // for (let i = 0; i < dataCart.length; i++) {
    //   start = performance.now();
    //   // await page.waitForSelector(cartTextPartNumber, {
    //   //   visible: true,
    //   // });
    //   await scrollElement(start, page, cartTextPartNumber);

    //   for (const item of dataCart[i]) {
    // await page.type(cartTextPartNumber, item.partNumber);
    //     await page.type(cartTxtQuantity, item.qty);
    //     await waiting(500);

    //     const btnAddItem = await page.waitForSelector(cartAddItem, {
    //       visible: true,
    //     });

    //     await btnAddItem.click();
    //     await waiting(2000);
    //     // await page.waitForSelector(cartTextPartNumber, {
    //     //   visible: true,
    //     // });
    //     // await page.waitForSelector(cartTxtQuantity, {
    //     //   visible: true,
    //     // });
    //   }
    //   end = performance.now();

    //   const clickAddItemCart = {
    //     testCase: "Add Item in Cart " + `Iterasi ${i + 1}`,
    //     duration: await timeCalc(end, start),
    //     isTestCaseSuccess,
    //   };

    //   cart_page.push(clickAddItemCart);
    //   console.log("Waiting for selector...");
    //   start = performance.now();
    //   const btnSelectVoucher = await page.waitForSelector(cartSelectVoucher, {
    //     visible: true,
    //   });

    //   const scrollBtnLihatVoucher = await scrollElement(
    //     start,
    //     page,
    //     cartSelectVoucher
    //   );

    //   cart_page.push(scrollBtnLihatVoucher);

    //   await waiting(1000);

    //   start = performance.now();
    //   await btnSelectVoucher.click();
    //   await waiting(1000);
    //   end = performance.now();

    //   const clickBtnSelectVoucher = {
    //     testCase: "Click Button Select Voucher " + `Iterasi ${i + 1}`,
    //     duration: await timeCalc(end, start),
    //     isTestCaseSuccess,
    //   };
    //   cart_page.push(clickBtnSelectVoucher);

    //   const cartUseVoucher = i === 0 ? cartUseVoucher1 : cartUseVoucher6;

    //   start = performance.now();
    //   const cartUseVoucherSelector = await page.waitForSelector(
    //     cartUseVoucher,
    //     {
    //       visible: true,
    //     }
    //   );

    //   const scrollSelector = await scrollElement(start, page, cartUseVoucher);
    //   cart_page.push(scrollSelector);

    //   await waiting(1000);

    //   start = performance.now();
    //   await cartUseVoucherSelector.click();
    //   await waiting(1000);
    //   end = performance.now();

    //   const clickUseVoucher1 = {
    //     testCase: "Click Use Voucher " + `Iterasi ${i + 1}`,
    //     duration: await timeCalc(end, start),
    //     isTestCaseSuccess,
    //   };
    //   cart_page.push(clickUseVoucher1);

    //   console.log("Waiting for selector...");
    //   start = performance.now();
    //   await page.waitForSelector("#ucModal1_ButtonText", {
    //     visible: true,
    //   }); // Waiting for the button to be visible
    //   await page.waitForSelector("#ucModal1_Body", {
    //     visible: true,
    //   });
    // start = performance.now();
    const textContent = await page.evaluate(() => {
      const paragraph = document.querySelector("#ucModal1_Body");
      return paragraph.textContent.trim(); // Trim to remove leading/trailing whitespace
    });

    console.log("textContent");
    console.log(textContent);

    console.log("Clicking the element OK...");
    await page.click("#ucModal1_ButtonText"); // Clicking the button
    end = performance.now();

    const clickButtonOK = {
      testCase: "Click OK After Use Voucher",
      duration: await timeCalc(end, start),
      isTestCaseSuccess,
    };
    cart_page.push(clickButtonOK);
    await waiting(1000);

    if (
      textContent ===
      "Voucher tidak dapat anda gunakan, karena item dalam troli anda tidak sesuai dengan item pada voucher!"
    ) {
      console.log("masuk if gabisa pake voucher");
      start = performance.now();
      const selector23 = 'a.fancybox-item.fancybox-close[title="Close"]';
      const tombolClose = await page.waitForSelector(selector23, {
        visible: true,
      });

      await waiting(2000);
      await tombolClose.click();
      end = performance.now();

      const clickCloseBtn = {
        testCase: `Click Button Close`,
        duration: await timeCalc(end, start),
        isTestCaseSuccess,
      };
      cart_page.push(clickCloseBtn);
    }

    await waiting(1000);
    await scrollElement(start, page, "#trGrandTotalAfterVoucherOrPoint");
    await waiting(1000);

    start = performance.now();
    const pilihMetodePembayaran = await page.waitForSelector(
      "#PaymentChannel_btnSelectPaymentChannel",
      {
        visible: true,
      }
    );
    await pilihMetodePembayaran.click();
    await waiting(1000);
    //*[@id="PaymentChannel_btnSelectPaymentChannel"]/table/tbody/tr[5]
    // await page.waitForSelector("#PaymentChannel_btnSelectPaymentChannel", {
    //   visible: true,
    // });
    await waiting(1000);
    // Now, find the row containing "Via Bank Transfer BCA" and click on it
    await page.evaluate(() => {
      // Find the element containing "Via Bank Transfer BCA"
      const targetRow = Array.from(document.querySelectorAll("tr")).find(
        (row) => row.innerText.includes("Via Bank Transfer BCA")
      );

      if (targetRow) {
        targetRow.click();
      }
    });
    // await page.click("#ucPaymentChannel > table > tbody > tr:nth-child(3)");
    end = performance.now();

    const chooseMethodPayment = {
      testCase: `Pilih Metode Pembayaran`,
      duration: await timeCalc(end, start),
      isTestCaseSuccess,
    };
    cart_page.push(chooseMethodPayment);

    await waiting(2000);
    // Langkah 1: Periksa status awal
    // let isHidden = await page.evaluate(() => {
    //   const element = document.getElementById("PaymentChannel_btnSelectPaymentChannel");
    //   return window.getComputedStyle(element).display === "none";
    // });

    // console.log("Sebelum diklik, elemen display: none?", isHidden);

    // Langkah 2: Klik elemen yang mempengaruhi PaymentChannel_btnSelectPaymentChannel
    // await page.click("#someTriggerElement"); // Ganti dengan selector yang sesuai
    // await waiting(1000);
    // const pilihMetodePembayaran = await page.waitForSelector(
    //   "#PaymentChannel_btnSelectPaymentChannel",
    //   {
    //     visible: true,
    //   }
    // );
    // await pilihMetodePembayaran.click();
    // await page.click("#PaymentChannel_btnSelectPaymentChannel > table > tbody > tr:nth-child(4)");
    // await waiting(1000);
    // Langkah 3: Periksa status setelah klik
    // isHidden = await page.evaluate(() => {
    //   const element = document.getElementById("PaymentChannel_btnSelectPaymentChannel");
    //   return window.getComputedStyle(element).display === "none";
    // });

    // console.log("Setelah diklik, elemen display: none?", isHidden);
    let isHidden = await page.evaluate(() => {
      const element = document.getElementById("divStepConfirmationStock");
      return window.getComputedStyle(element).display === "none";
    });

    console.log("Sebelum diklik, elemen display: none?", isHidden);

    await waiting(2000);
    start = performance.now();
    const kirimOrderBtn = await page.waitForSelector("#btnSave", {
      visible: true,
    });
    // await page.click("#btnSave");
    await kirimOrderBtn.click();
    await waiting(1000);
    end = performance.now();

    const clickBtnKirimOrder = {
      testCase: `Klik Button Kirim Order`,
      duration: await timeCalc(end, start),
      isTestCaseSuccess,
    };
    cart_page.push(clickBtnKirimOrder);
    waiting(2000);
    isHidden = await page.evaluate(() => {
      const element = document.getElementById("divStepConfirmationStock");
      return window.getComputedStyle(element).display === "none";
    });

    console.log("Setelah diklik, elemen display: none?", isHidden);

    let isStockAvailable = "Y";
    if (isHidden) {
      console.log("stok ada");
    } else {
      console.log("stok abis");
      isStockAvailable = "N";
    }

    // console.log("isStockAvailable");
    // console.log(isStockAvailable);

    if (isStockAvailable === "N") {
      start = performance.now();
      const btnBatalkanPesanan = await page.waitForSelector(
        "#ConfirmationStock_btnBatalkanPesanan",
        {
          visible: true,
        }
      );
      await btnBatalkanPesanan.click();
      end = performance.now();

      const clickButtonOK = {
        testCase: "Klik Batalkan Pesanan karna stok kosong",
        duration: await timeCalc(end, start),
        isTestCaseSuccess,
      };
      cart_page.push(clickButtonOK);
    }

    if (isStockAvailable === "Y") {
      start = performance.now();
      console.log("Clicking the element OK...");
      await page.waitForSelector(".modal-content", {
        visible: true,
      });
      await waiting(1000);
      await page.click("#ucModal1_ButtonText"); // Clicking the button'
      end = performance.now();

      const clickButtonOK = {
        testCase: "Click OK After Send Order",
        duration: await timeCalc(end, start),
        isTestCaseSuccess,
      };
      cart_page.push(clickButtonOK);
      // start = performance.now();
      // // console.log("Clicking the element OK...");
      // // await page.waitForSelector(".PaymentOnline_PaymentBox", {
      // //   visible: true,
      // // });
      // // const scrollLihatVA = await scrollElement(
      // //   start,
      // //   page,
      // //   ".PaymentOnline_PaymentBox"
      // // );
      // end = performance.now();

      // cart_page.push(scrollLihatVA);
    }
    // Mengambil semua elemen yang cocok dengan selector
    // Event listener untuk menangani dialog alert

    // start = performance.now();
    // await page.waitForSelector(".GridButtonDelete", {
    //   visible: true,
    // });
    // await page.$$eval(".GridButtonDelete", (elements) => {
    //   elements.forEach(async (element, index) => {
    //     element.click();
    //   });
    // });
    // end = performance.now();
    // const deleteAllProduct = {
    //   testCase: "Remove all product in cart",
    //   duration: await timeCalc(end, start),
    //   isTestCaseSuccess,
    // };
    // cart_page.push(deleteAllProduct);

    // }
    await waiting(1000);
    await page.waitForNavigation();
    return { cart_page };
  } catch (err) {
    isTestCaseSuccess = false;
    console.error(err);
    logToFile(`Error: ${err.message}`);
  }
};

module.exports = {
  cartPage,
};
