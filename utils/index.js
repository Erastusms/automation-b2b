// Fungsi untuk mengevaluasi XPath di dalam halaman
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

module.exports = { clickElementByXPath };
