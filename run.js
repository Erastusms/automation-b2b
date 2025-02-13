require("dotenv").config();

const express = require("express");
const path = require("path");
const { run } = require("./main");
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.raw());

app.use(express.static(path.join(__dirname)));

app.get("/run", async (req, res) => {
  const env = req.query.query;
  try {
    await run(env);
    res.status(200).send(`run() called with environment: ${env}`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to run Puppeteer function" });
  }
});

app.get("/", (req, res) =>
  res.status(200).json({
    message: "Automation Testing B2B",
  })
);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
