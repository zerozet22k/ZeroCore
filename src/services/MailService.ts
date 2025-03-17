import nodemailer, { SendMailOptions } from "nodemailer";
import SettingService from "@/services/SettingService";
import { MAIL_SETTINGS_KEYS } from "@/config/CMS/settings/keys/MAIL_KEYS";
import { SettingsInterface } from "@/config/CMS/settings/settingKeys";

const settingService = new SettingService();

export default class MailService {
  private transporter: nodemailer.Transporter | undefined;
  private adminEmail: string | undefined;

  constructor() {
    this.init();
  }

  private async init() {
    try {
      const settings =
        (await settingService.getAllSettings()) as SettingsInterface;

      this.adminEmail = settings[MAIL_SETTINGS_KEYS.ADMIN_EMAIL];

      if (
        settings[MAIL_SETTINGS_KEYS.GMAIL]?.user &&
        settings[MAIL_SETTINGS_KEYS.GMAIL]?.password
      ) {
        this.transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 465,
          secure: true,
          auth: {
            user: settings[MAIL_SETTINGS_KEYS.GMAIL].user,
            pass: settings[MAIL_SETTINGS_KEYS.GMAIL].password,
          },
        });
      } else if (
        settings[MAIL_SETTINGS_KEYS.OUTLOOK]?.user &&
        settings[MAIL_SETTINGS_KEYS.OUTLOOK]?.password
      ) {
        this.transporter = nodemailer.createTransport({
          host: "smtp.office365.com",
          port: 587,
          secure: false,
          auth: {
            user: settings[MAIL_SETTINGS_KEYS.OUTLOOK].user,
            pass: settings[MAIL_SETTINGS_KEYS.OUTLOOK].password,
          },
        });
      } else if (settings[MAIL_SETTINGS_KEYS.SENDGRID]?.apiKey) {
        this.transporter = nodemailer.createTransport({
          host: "smtp.sendgrid.net",
          port: 587,
          secure: false,
          auth: {
            user: "apikey",
            pass: settings[MAIL_SETTINGS_KEYS.SENDGRID].apiKey,
          },
        });
      } else {
        console.error("❌ Email configuration is incomplete.");
      }
    } catch (error) {
      console.error("❌ Error initializing mail service:", error);
    }
  }
  public async sendMail(
    subject: string,
    text: string,
    attachments?: SendMailOptions["attachments"]
  ) {
    if (!this.transporter || !this.adminEmail) {
      throw new Error("❌ Email configuration is incomplete.");
    }

    const mailOptions: SendMailOptions = {
      from: (this.transporter.options as any)?.auth?.user,
      to: this.adminEmail,
      subject,
      text,
      attachments,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log("✅ Email sent:", info.messageId);
      return info;
    } catch (error) {
      console.error("❌ Error sending email:", error);
      throw error;
    }
  }
}
