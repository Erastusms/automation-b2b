const URL = {
  home: "https://bisnis.astraotoshop.com/UI/eCommerce/Home.aspx",
  login: "https://bisnis.astraotoshop.com/UI/eCommerce/Login.aspx",
};

const dataLogin = {
  username: "1000013132",
  password: "Christian1",
};

const selectorList = {
  XPathBtnTextLogin:
    '//*[@id="ctl00_panelWebsiteWidth"]/table/tbody/tr[1]/td/table/tbody/tr/td/table/tbody/tr[2]/td/table/tbody/tr/td[2]/table/tbody/tr[1]/td[1]/a',
  XPathTotalPoint:
    '//*[@id="ctl00_panelWelcome"]/table/tbody/tr[2]/td/table/tbody/tr/td[1]/table/tbody/tr/td[2]',
  XPathTotalKoin:
    '//*[@id="ctl00_panelWelcome"]/table/tbody/tr[2]/td/table/tbody/tr/td[3]/table/tbody/tr/td[2]',
  closeSelectorPoint: "#divPointV2_Step1_CloseButton",
  closeSelectorKoin: 'a.fancybox-item.fancybox-close[title="Close"]',
  inputUsername: "#ctl00_ContentPlaceHolder1_txtUserName",
  inputPassword: "#ctl00_ContentPlaceHolder1_txtPassword",
  btnLogin: "#ctl00_ContentPlaceHolder1_btnLogin",
  XPathBtnOKAddToCart: '//*[@id="ucModalProductSuccessAdd_ButtonOk"]/td/input',
  searchField: "#txtSearchEngine1",
  searchWord: "gsmf",
  searchBtn: "#btnSearchEngine1",
  searchAddToCart: "#btnAddToCart_GSMF-GTZ-4V",
  skuRecom: "#btnAddToCart_FP-06435-KPP-2700",
  skuUnggulan: "#btnAddToCart_GSMF-GM5Z-3B",
  skuUnggulanDetail: "#btnProductDetails_GSMF-GM5Z-3B",
  skuUnggulanSparePart: "#btnAddToCart_TO-15601-AVZ-1800",
  btnSuccessAddToCart: "input.ButtonAction[value='Ok']",
  btnAddTroliDetail: "input.ButtonAction[value='Tambah Ke Troli']",
  btnAddTroliDetailXPath:
    '//*[@id="tableDialogItemDetails"]/tbody/tr[5]/td/table/tbody/tr[2]/td/input',
  cartIcon: "#imgIconCart",
  cartAddItem: "#btnAddItem",
  cartUseVoucher1: "#btnUseVoucher1",
  cartUseVoucher6: "#btnUseVoucher6",
  cartSelectVoucher: "#btnSelectVoucher",
  cartTextPartNumber: "#txtPartNumber",
  cartTxtQuantity: "#txtQuantity",
  cartIFrame: "#iframe1",
  cartDownloadBtn: "#ctl00_ContentPlaceHolder1_btnDownload",
  cartFileUpload: "#ctl00_ContentPlaceHolder1_fileupload",
  cartUploadBtn: "#ctl00_ContentPlaceHolder1_btnUpload",
  cartTextSearchVoucher: "#divSelectVoucher_txtSearch",
  cartInputVoucher: "TUBE50",
  cartSearchVoucherBtn: "#divSelectVoucher_btnSearch"
};

const pathDownload = "./downloads";
const pathUpload = "./upload/Template-Cart.xlsx";

const cartData = [
  {
    partNumber: "GSMF-GTZ-4V",
    qty: "5",
  },
  {
    partNumber: "GSCAL-105D31L",
    qty: "2",
  },
  {
    partNumber: "INMF-555-59",
    qty: "12",
  },
  {
    partNumber: "INMF-544-59",
    qty: "1",
  },
  {
    partNumber: "01-SPO-TL110/7017F",
    qty: "5",
  },
];

const cartDataWithVoucher = [
  {
    partNumber: "12-25017-00000",
    qty: "100",
  },
  {
    partNumber: "12-27517-00000",
    qty: "200",
  },
];

module.exports = {
  URL,
  dataLogin,
  selectorList,
  cartData,
  cartDataWithVoucher,
  pathDownload,
  pathUpload,
};
