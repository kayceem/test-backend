import nodemailer, { Transporter, SendMailOptions } from "nodemailer";
import smtp from '../config/smtpConfig.json';

interface SmtpConfig {
  host: string;
  port: number;
  secure: boolean;
  service: string;
  auth: {
    user: string;
    pass: string;
  };
  from:string;
}

const smtpConfig: SmtpConfig = {
  host: smtp.host,
  port: smtp.port,
  secure: smtp.secure,
  service: smtp.service,
  auth: {
    user: smtp.auth.user,
    pass: smtp.auth.pass,
  },
  from: smtp.from,
};

const transporter: Transporter = nodemailer.createTransport(smtpConfig);

async function sendEmail(options: SendMailOptions): Promise<void> {
  try {
    const info = await transporter.sendMail(options);
    console.log("Email sent: ", info.response);
  } catch (error) {
    console.error("Error when sending email: ", error);
  }
}

export default sendEmail;
