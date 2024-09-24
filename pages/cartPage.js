const fs = require("fs");
const path = require("path");
const { scrollElement } = require("../components");
const {
  selectorList: {
    cartIcon,
    cartAddItem,
    cartUseVoucher1,
    cartUseVoucher6,
    cartSelectVoucher,
    cartTextPartNumber,
    cartTxtQuantity,
    cartIFrame,
    cartDownloadBtn,
    cartFileUpload,
    cartUploadBtn,
    cartTextSearchVoucher,
    cartInputVoucher,
    cartSearchVoucherBtn,
  },
  cartData,
  cartDataWithVoucher,
  pathDownload,
  pathUpload,
} = require("../constant");
const { waiting, timeCalc } = require("../utils");

const dataCart = [cartData, cartDataWithVoucher];

const cartPage = async (page) => {
  const isTestCaseSuccess = true;
  const cart_page = [];
  let start = performance.now();
  try {
    // Tentukan folder tempat file akan diunduh
    const downloadPath = path.resolve(pathDownload);
    fs.mkdirSync(downloadPath, { recursive: true });

    // Mengatur perilaku download untuk menyimpan file di folder yang ditentukan
    await page._client().send("Page.setDownloadBehavior", {
      behavior: "allow",
      downloadPath: downloadPath,
    });

    const imgIconCart = await page.waitForSelector(cartIcon, {
      visible: true,
    });

    await Promise.all([
      imgIconCart.click(),
      page.waitForNavigation({ waitUntil: "networkidle2" }),
    ]);
    let end = performance.now();

    const clickButtonCart = {
      testCase: "Click Button Cart",
      duration: await timeCalc(end, start),
      isTestCaseSuccess,
    };

    cart_page.push(clickButtonCart);

    // pada halaman cart

    console.log("Masuk halaman cart");
    page.on("dialog", async (dialog) => {
      await waiting(1000);
      await dialog.accept(); // Klik tombol "OK" di dialog alert
    });

    await waiting(2000);

    // Tunggu iframe untuk dimuat
    start = performance.now();
    await page.waitForSelector(cartIFrame, { visible: true });

    // Ambil handle ke iframe
    const iframeHandle = await page.$(cartIFrame);
    const iframeContent = await iframeHandle.contentFrame();

    // Klik tombol input di dalam iframe
    await iframeContent.click(cartDownloadBtn);
    console.log("Tombol submit telah diklik.");
    end = performance.now();

    const clickDownloadBtn = {
      testCase: "Click Button Download",
      duration: await timeCalc(end, start),
      isTestCaseSuccess,
    };

    cart_page.push(clickDownloadBtn);

    start = performance.now();
    const filePath = path.relative(process.cwd(), pathUpload);

    await waiting(2000);
    // Upload file dengan cara memasukkan path file ke input file
    const inputUploadHandle = await iframeContent.$(cartFileUpload);
    await inputUploadHandle.uploadFile(filePath);

    console.log("File has been selected for upload.");

    // Tunggu tombol upload tersedia dan klik tombol upload
    await iframeContent.waitForSelector(cartUploadBtn);
    await iframeContent.click(cartUploadBtn);

    console.log("Upload button clicked.");
    end = performance.now();

    const clickUploadBtn = {
      testCase: "Upload File Action",
      duration: await timeCalc(end, start),
      isTestCaseSuccess,
    };

    cart_page.push(clickUploadBtn);

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

    // await page.waitForSelector(cartTextSearchVoucher, {
    //   visible: true,
    // });

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
    await page.click("#ucModal1_ButtonText"); // Clicking the button'
    end = performance.now();

    const clickButtonOK = {
      testCase: "Click OK After Use Voucher",
      duration: await timeCalc(end, start),
      isTestCaseSuccess,
    };
    cart_page.push(clickButtonOK);
    await waiting(1000);

    //   console.log("Waiting for selector...");

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
    await page.click("#ucPaymentChannel > table > tbody > tr:nth-child(3)");
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

    start = performance.now();
    const kirimOrderBtn = await page.waitForSelector("#btnSave", {
      visible: true,
    });
    await kirimOrderBtn.click();
    await waiting(1000);
    end = performance.now();

    const clickBtnKirimOrder = {
      testCase: `Klik Button Kirim Order`,
      duration: await timeCalc(end, start),
      isTestCaseSuccess,
    };
    cart_page.push(clickBtnKirimOrder);

    isHidden = await page.evaluate(() => {
      const element = document.getElementById("divStepConfirmationStock");
      return window.getComputedStyle(element).display === "none";
    });

    console.log("Setelah diklik, elemen display: none?", isHidden);

    // const isStockAvailable = await page.evaluate(() => {
    //   const alertConfirmStock = document.getElementById(
    //     "ConfirmationStock_btnBatalkanPesanan"
    //   );

    //   console.log("alertConfirmStock");
    //   console.log(alertConfirmStock);

    //   if (alertConfirmStock) {
    //     console.log("stok ada yang kosong");
    //     return "N";
    //   } else {
    //     console.log("stok aman");
    //     return "Y";
    //   }
    // });

    // const pageStokKosong = await page.$(
    //   "#ConfirmationStock_btnBatalkanPesanan"
    // );
    // console.log('pageStokKosong')
    // console.log(pageStokKosong)
    // let isStockAvailable = "Y";
    // if (pageStokKosong) {
    //   console.log(
    //     "Elemen dengan ID ConfirmationStock_btnBatalkanPesanan sudah ter-load."
    //   );
    //   isStockAvailable = "N";
    // } else {
    //   console.log(
    //     "Elemen dengan ID ConfirmationStock_btnBatalkanPesanan tidak ditemukan."
    //   );
    // }
    // const modalStockAda = await page.$(".modal-content");
    // console.log("textContentSendOrder");
    // console.log(textContentSendOrder);
    let isStockAvailable = "Y";
    if (isHidden) {
      //textnya masih salah jadi stoknya N
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
        testCase: "Click Batalkan Pesanan Karna ada stok kosong",
        duration: await timeCalc(end, start),
        isTestCaseSuccess,
      };
      cart_page.push(clickButtonOK);

      await waiting(1000);
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
      await waiting(1000);

      await page.waitForNavigation()
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
    return { cart_page };
  } catch (err) {
    console.log("error");
    console.log({
      error: err,
    });
  }
};

module.exports = {
  cartPage,
};
