const path = require("path");
const nodemailer = require("nodemailer");
const moment = require("moment");

const { dataEmail } = require("../config");

const emailSender = async (pdfFilePath) => {
  const currentDate = moment().format("L");
  // Konfigurasi transporter email
  const transporter = nodemailer.createTransport({
    service: dataEmail.service,
    auth: {
      user: dataEmail.user,
      pass: dataEmail.pass,
    },
  });

  // Detail email
  const mailOptions = {
    from: dataEmail.user,
    to: dataEmail.to,
    // cc: process.env.EMAIL_CC,
    subject: `Testing B2B - ${currentDate}`,
    text: `Testing B2B yang dilakukan pada ${currentDate} dengan report pada lampiran`,
    attachments: [
      {
        filename: path.basename(pdfFilePath),
        path: pdfFilePath, // Lampirkan file PDF yang telah di-generate
      },
    ],
  };

  // Kirim email
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error("Gagal mengirim email:", err);
    } else {
      console.log("Email berhasil dikirim:", info.response);
    }
  });
};

module.exports = { emailSender };
