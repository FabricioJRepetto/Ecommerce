const nodemailer = require("nodemailer");
require("dotenv").config();
const { NODEMAILER_USER, NODEMAILER_PASSWORD } = process.env;

const sendEmail = async (email, link) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: NODEMAILER_USER,
        pass: NODEMAILER_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: '"Fred Foo 👻" <foo@example.com>',
      to: "bar@example.com, baz@example.com", //email
      subject: "Prueba",
      text: "Prueba en texto plano",
      html: `<h1>Prueba </h1><b>en html </b><a href=${link}>linkkkkk </a>`,
    });
  } catch (error) {
    throw new Error("Email not sent");
  }
};

module.exports = sendEmail;
