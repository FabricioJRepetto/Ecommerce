require("dotenv").config();
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const fs = require("fs-extra");
const path = require("path");
const handlebars = require("handlebars");
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

const sendEmail = async (email, subject, templateUrl, variable) => {
  try {
    const filePath = path.join(__dirname, templateUrl);
    const source = fs.readFileSync(filePath, "utf-8").toString();
    const template = handlebars.compile(source);
    const replacements = variable;
    const html = template(replacements);

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
      from: `Provider <${EMAIL_EPROVIDER}>`,
      to: email,
      subject,
      html,
    };

    const result = await transport.sendMail(mailOptions);
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = sendEmail;
