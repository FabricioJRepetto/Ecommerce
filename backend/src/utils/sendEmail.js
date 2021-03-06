const nodemailer = require("nodemailer");
const { google } = require("googleapis");
require("dotenv").config();
const {
  EMAIL_OAUTH_CLIENT_ID,
  EMAIL_CLIENT_SECRET,
  REDIRECT_URI,
  REFRESH_TOKEN,
  EMAIL_EPROVIDER,
} = process.env;

const oAuth2Client = new google.auth.OAuth2(
  EMAIL_OAUTH_CLIENT_ID,
  EMAIL_CLIENT_SECRET,
  REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const sendEmail = async (email, subject, link, html) => {
  try {
    const accessToken = await oAuth2Client.getAccessToken();
    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: EMAIL_EPROVIDER,
        clientId: EMAIL_OAUTH_CLIENT_ID,
        clientSecret: EMAIL_CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });

    const mailOptions = {
      from: `eProvider Store <${EMAIL_EPROVIDER}>`,
      to: email,
      subject,
      html: `<h1>Prueba </h1><b>en html </b><a href=${link}>linkkkkk </a>`,
    };

    const result = await transport.sendMail(mailOptions);
    return result;
  } catch (error) {
    console.log(error.response.data);
    throw new Error(error);
  }
};

module.exports = sendEmail;
