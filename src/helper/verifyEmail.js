const transporter = require("../config/email");
require("dotenv").config();

const mailOptions = {
    from: process.env.EMAIL, // Alamat email pengirim
    to: "recipient_email@example.com", // Alamat email penerima
    subject: "Verify your Account", // Subjek email
    text: "Halo Please verify your account", // Isi email dalam plain text
    html: "<b>Halo,</b><br><p>Please verify your account</p>", // Isi email dalam format HTML
};
