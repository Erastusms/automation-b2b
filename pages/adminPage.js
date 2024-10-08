const { login, scrollElement } = require("../components");
const {
  URL,
  dataLogin: { usernameAdmin, passwordAdmin },
} = require("../config");
const {
  selectorList: {
    inputUsernameAdminB2B,
    inputPasswordAdminB2B,
    btnLoginAdminB2B,
  },
} = require("../constant");
const { logToFile, waitSelectorAdmin, waiting } = require("../utils");

const adminPage = async (page) => {
  let start = performance.now();
  logToFile("Admin Page - Open Suspend");
  await page.goto(URL.adminb2b, { timeout: 0, waitUntil: "networkidle0" });

  const options = {
    inputUsername: inputUsernameAdminB2B,
    inputPassword: inputPasswordAdminB2B,
    btnLogin: btnLoginAdminB2B,
    username: usernameAdmin,
    password: passwordAdmin,
  };
  await login(page, options);

  // await waiting(2000);

  await waitSelectorAdmin(page, ".side-menu__item", "Admin");
  await waitSelectorAdmin(page, ".sub-side-menu__item", "Manage User");
  await waitSelectorAdmin(page, ".sub-slide-item", "List User");

  console.log("Clicked on List User");
  await page.waitForNavigation({ waitUntil: "networkidle0" });
  await page.type("#txtSearch", "1000013132");

  // Tunggu sampai tombol tersedia
  // await page.waitForSelector("button.btn.btn-primary");

  // // Klik tombol dengan class 'btn btn-primary' dan onclick "btnSearch_Click('Search', null)"
  // await page.evaluate(() => {
  //   const button = document.querySelector(
  //     "button.btn.btn-primary[onclick=\"btnSearch_Click('Search', null)\"]"
  //     // "button.btn.btn-primary"
  //   );
  //   if (button) button.click();
  // });
  const btnSearch = await page.waitForSelector(
    "button.btn.btn-primary[onclick=\"btnSearch_Click('Search', null)\"]",
    {
      visible: true,
    }
  );

  await btnSearch.click();
  await waiting(1000);
  await page.waitForSelector(".GridRowContainerOdd", {
    visible: true,
  });

  const scrollLihatVA = await scrollElement(
    start,
    page,
    ".btn.btn-sm.btn-info.btn-b"
  );

  await page.click(".btn.btn-sm.btn-info.btn-b");
  await page.waitForSelector("#Entry_txtSuspendDate", {
    visible: true,
  });
  await scrollElement(start, page, "#Entry_txtSuspendDate");
  await waiting(2000);
  // Kosongkan input field
  await page.evaluate(() => {
    const inputField = document.querySelector("#Entry_txtSuspendDate");
    if (inputField) inputField.value = "";
  });
  console.log("Input field cleared");

  await scrollElement(start, page, "#Entry_btnSave");

  await page.evaluate(() => {
    const btnSave = document.querySelector("#Entry_btnSave");
    if (btnSave) btnSave.click();
  });

  console.log("button save clicked");

  //   await page.goto(URL.home, { timeout: 0, waitUntil: "networkidle0" });
  //   await cartPage(page);
};

module.exports = { adminPage };
