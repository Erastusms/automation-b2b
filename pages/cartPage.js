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
  },
  cartData,
  cartDataWithVoucher,
} = require("../constant");
const { waiting, timeCalc } = require("../utils");

const dataCart = [cartData, cartDataWithVoucher];

const cartPage = async (page) => {
  const loginResponse = true;
  const cart_page = [];
  let start = performance.now();
  try {
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
      loginResponse,
    };

    cart_page.push(clickButtonCart);

    // pada halaman cart

    page.on("dialog", async (dialog) => {
      await waiting(1000);
      await dialog.accept(); // Klik tombol "OK" di dialog alert
    });

    for (let i = 0; i < dataCart.length; i++) {
      start = performance.now();
      // await page.waitForSelector(cartTextPartNumber, {
      //   visible: true,
      // });
      await scrollElement(start, page, cartTextPartNumber);

      for (const item of dataCart[i]) {
        await page.type(cartTextPartNumber, item.partNumber);
        await page.type(cartTxtQuantity, item.qty);
        await waiting(500);

        const btnAddItem = await page.waitForSelector(cartAddItem, {
          visible: true,
        });

        await btnAddItem.click();
        await waiting(2000);
        // await page.waitForSelector(cartTextPartNumber, {
        //   visible: true,
        // });
        // await page.waitForSelector(cartTxtQuantity, {
        //   visible: true,
        // });
      }
      end = performance.now();

      const clickAddItemCart = {
        testCase: "Add Item in Cart " + `Iterasi ${i + 1}`,
        duration: await timeCalc(end, start),
        loginResponse,
      };

      cart_page.push(clickAddItemCart);
      console.log("Waiting for selector...");
      start = performance.now();
      const btnSelectVoucher = await page.waitForSelector(cartSelectVoucher, {
        visible: true,
      });

      const scrollBtnLihatVoucher = await scrollElement(
        start,
        page,
        cartSelectVoucher
      );

      cart_page.push(scrollBtnLihatVoucher);

      await waiting(1000);

      start = performance.now();
      await btnSelectVoucher.click();
      await waiting(1000);
      end = performance.now();

      const clickBtnSelectVoucher = {
        testCase: "Click Button Select Voucher " + `Iterasi ${i + 1}`,
        duration: await timeCalc(end, start),
        loginResponse,
      };
      cart_page.push(clickBtnSelectVoucher);

      const cartUseVoucher = i === 0 ? cartUseVoucher1 : cartUseVoucher6;

      start = performance.now();
      const cartUseVoucherSelector = await page.waitForSelector(
        cartUseVoucher,
        {
          visible: true,
        }
      );

      const scrollSelector = await scrollElement(start, page, cartUseVoucher);
      cart_page.push(scrollSelector);

      await waiting(1000);

      start = performance.now();
      await cartUseVoucherSelector.click();
      await waiting(1000);
      end = performance.now();

      const clickUseVoucher1 = {
        testCase: "Click Use Voucher " + `Iterasi ${i + 1}`,
        duration: await timeCalc(end, start),
        loginResponse,
      };
      cart_page.push(clickUseVoucher1);

      console.log("Waiting for selector...");
      start = performance.now();
      await page.waitForSelector("#ucModal1_ButtonText", {
        visible: true,
      }); // Waiting for the button to be visible
      await page.waitForSelector("#ucModal1_Body", {
        visible: true,
      });
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
        testCase: "Click OK After Use Voucher " + `Iterasi ${i + 1}`,
        duration: await timeCalc(end, start),
        loginResponse,
      };
      cart_page.push(clickButtonOK);
      await waiting(1000);

      console.log("Waiting for selector...");

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
          loginResponse,
        };
        cart_page.push(clickCloseBtn);
      }
      // await waiting(1000);
      await scrollElement(start, page, "#trGrandTotalAfterVoucherOrPoint");
      // await waiting(1000);

      await page.waitForSelector(".GridButtonDelete", {
        visible: true,
      });

      // Mengambil semua elemen yang cocok dengan selector
      // Event listener untuk menangani dialog alert

      await page.$$eval(".GridButtonDelete", (elements) => {
        elements.forEach(async (element, index) => {
          start = performance.now();

          element.click();

          end = performance.now();
        });
      });
    }
    return { cart_page };
  } catch (err) {
    console.error(err);
  }
};

module.exports = {
  cartPage,
};
