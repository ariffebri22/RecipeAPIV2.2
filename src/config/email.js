const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.EMAIL, // Ganti dengan alamat email Anda
        pass: process.env.PASS, // Ganti dengan password email Anda
    },
});

module.exports = transporter;
