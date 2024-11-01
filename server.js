const express = require("express");
const path = require("path");
const { run } = require("./main");
const app = express();

app.use(express.static(path.join(__dirname)));

app.get("/run", async (req, res) => {
  const env = req.query.env;
  try {
    await run(env);
    res.status(200).send(`run() called with environment: ${env}`);
  } catch (error) {
    res.status(500).send("Error running Puppeteer");
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
