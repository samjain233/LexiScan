import { mailTransporter } from "../../config/mail.config.js";

export const sendMailService = async (email, subject, text) => {
    try {
        const details = {
            from: process.env.MAIL_ID,
            to: email,
            subject: subject,
            text: text,
        };
        mailTransporter.sendMail(details, (err, info) => {
            if (err) {
                console.log("error occured in sending mail", err);
            } else {
                console.log("mail sent", info);
            }
        });
    } catch (error) {
        console.log("unable to send mail", error);
    }
};