import { transport, sender } from "./mailtrap.config.js";
import { 
  VERIFICATION_EMAIL_TEMPLATE, 
  WELCOME_EMAIL_TEMPLATE, 
  PASSWORD_RESET_REQUEST_TEMPLATE, 
  PASSWORD_RESET_SUCCESS_TEMPLATE 
} from "./emailTemplates.js";

/**
 * Send Verification Email
 */
export const sendVerificationEmail = async (email, verificationToken) => {
  try {
    const verificationURL = `${process.env.CLIENT_URL}/verify-email`;
    const htmlContent = VERIFICATION_EMAIL_TEMPLATE
      .replace("{verificationCode}", verificationToken)
      .replace("{verificationURL}", verificationURL);

    await transport.sendMail({
      from: sender,
      to: email,
      subject: "Verify Your Email Address",
      html: htmlContent,
      category: "Email Verification",
    });

    console.log(`✅ Verification email sent to ${email}`);
  } catch (error) {
    console.error("❌ Error sending verification email:", error.message);
  }
};

/**
 * Send Welcome Email
 */
export const sendWelcomeEmail = async (email, name) => {
  try {
    const htmlContent = WELCOME_EMAIL_TEMPLATE
      .replace(/{{userName}}/g, name)
      .replace(/{{year}}/g, new Date().getFullYear())
      .replace(/\[Your App Name\]/g, "AEROLink");

    await transport.sendMail({
      from: sender,
      to: email,
      subject: "Welcome to AEROLink",
      html: htmlContent,
      category: "Welcome Email",
    });

    console.log(`✅ Welcome email sent to ${email}`);
  } catch (error) {
    console.error("❌ Error sending welcome email:", error.message);
  }
};

/**
 * Send Password Reset Request Email
 */
export const resetPasswordEmail = async (email, resetURL) => {
  try {
    const htmlContent = PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL);

    await transport.sendMail({
      from: sender,
      to: email,
      subject: "Reset Your Password",
      html: htmlContent,
      category: "Reset Password Link",
    });

    console.log(`✅ Reset password email sent to ${email}`);
  } catch (error) {
    console.error("❌ Error sending reset password email:", error.message);
  }
};

/**
 * Send Password Reset Success Email
 */
export const sendResetPassSuccessEmail = async (email) => {
  try {
    const htmlContent = PASSWORD_RESET_SUCCESS_TEMPLATE;

    await transport.sendMail({
      from: sender,
      to: email,
      subject: "Password Reset Successfully",
      html: htmlContent,
      category: "Password Reset Success",
    });

    console.log(`✅ Password reset success email sent to ${email}`);
  } catch (error) {
    console.error("❌ Error sending password reset success email:", error.message);
  }
};
