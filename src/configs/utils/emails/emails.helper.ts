import nodemailer from "nodemailer";
import ejs from "ejs";
import path from "path";
import { envMailServices } from "../../constants/config.env";
import { EmailError } from "../errors/errors.handler";

interface renderEmailTemplate_params {
  templateName: string;
  data: Record<string, any>;
}

export interface sendEmail_params {
  to: string;
  subject: string;
  templateName: string;
  data: Record<string, any>;
}

const transporter = nodemailer.createTransport({
  host: envMailServices.SMTP_HOST,
  port: envMailServices.SMTP_PORT,
  service: envMailServices.SMTP_SERVICE,
  auth: {
    user: envMailServices.SMTP_USER,
    pass: envMailServices.SMTP_PASSWORD,
  },
});

export const renderEmailTemplate = async (
  params: renderEmailTemplate_params
): Promise<string> => {
  const { templateName, data } = params;
  const templatePath = path.join(
    process.cwd(),
    "src",
    "views",
    "email-templates",
    `${templateName}.ejs`
  );
  return ejs.renderFile(templatePath, data);
};

export const sendEmail = async (params: sendEmail_params) => {
  const { to, subject, templateName, data } = params;
  const render_Params = { templateName, data };
  try {
    const html = await renderEmailTemplate(render_Params);
    await transporter.sendMail({
      from: `<${envMailServices.SMTP_USER}`,
      to,
      subject,
      html,
    });
    return true;
  } catch (error) {
    throw new EmailError("failed to send email");
  }
};
