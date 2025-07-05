/* eslint-disable import/no-extraneous-dependencies */
const nodemailer = require("nodemailer");
const path = require("path");
const ejs = require("ejs");

const OTP_EMAIL = process.env.OTP_EMAIL;
const SEND_GRID_USER = process.env.SEND_GRID_USER;
const SEND_GRID_API_KEY = process.env.SEND_GRID_API_KEY;

function sendEmail({
    userEmail, subject, templatePath = "../templates/otp-template.ejs",
    placeholders,
}) {
    console.log(process.env.NODE_ENV, OTP_EMAIL, SEND_GRID_USER, SEND_GRID_API_KEY);
    const mailTransporter = nodemailer.createTransport({
        host: "smtp.sendgrid.net",
        auth: {
            user: SEND_GRID_USER,
            pass: SEND_GRID_API_KEY,
        },
        port: process.env.NODE_ENV === "dev" ? 587 : 465,
        secure: process.env.NODE_ENV !== "dev", // Use true if using 465
    });
    const mailDetails = {
        from: OTP_EMAIL,
        to: userEmail,
        subject,
        attachments: [{
            fileName: "heydu-logo.png",
            path: path.resolve(__dirname, "../images/heydu-logo.png"),
            cid: "heydu-logo",
        }],
    };

    return new Promise((resolve, reject) => {
        ejs.renderFile(
            path.resolve(__dirname, templatePath),
            placeholders,

            (e, html) => {
                if (e) reject(e);

                resolve(mailTransporter.sendMail({
                    ...mailDetails,
                    html,
                }));
            },
        );
    });
}

module.exports = sendEmail;
