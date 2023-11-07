import { createTransport } from "nodemailer";

type messageType = {
  from?: string;
  to: string;
  subject?: string;
  text?: string;
  html?: string;
};
export async function sendEmail({ subject, text, html, to }: messageType) {
  const transporter = createTransport({
    host: "smtp.gmail.com",
    secure: true,
    port: 465,
    service: "gmail",
    auth: {
      user: process.env.PUBLIC_EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  const message: messageType = {
    from: "Online Shop",
    to,
  };
  if (text) {
    message.text = text;
  }
  if (html) {
    message.html = html;
  }
  if (subject) {
    message.subject = subject;
  }
  await transporter.sendMail(message);
}
