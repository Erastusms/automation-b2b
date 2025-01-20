const xlsx = require("xlsx");
const filePath = "./downloads/Template-Testing.xlsx";

const readDataExcel = (sheetNumber) => {
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[sheetNumber];
  const sheet = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json(sheet);
  return data;
};

module.exports = {
    readDataExcel
}
