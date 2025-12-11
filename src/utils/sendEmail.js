import nodemailer from "nodemailer";


export const sendEmail = async (to, subject, text) => {
  // Validate environment variables first
  if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
    const error = new Error("Gmail credentials not configured");
    error.code = "ENV_MISSING";
    throw error;
  }

  try {
    console.log(`📧 Creating Gmail transporter...`);
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS, // Gmail App Password
      },
    });

    // Verify connection first
    console.log(`📧 Verifying Gmail connection...`);
    await transporter.verify();
    console.log(`✅ Gmail connection verified successfully`);

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to,
      subject,
      text,
    };

    console.log(`📧 Sending email from ${process.env.GMAIL_USER} to ${to}...`);
    const result = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully:", {
      messageId: result.messageId,
      response: result.response
    });
    return result;
  } catch (error) {
    console.error("❌ Error in sendEmail function:");
    console.error("   Code:", error.code);
    console.error("   Message:", error.message);
    console.error("   Response:", error.response);
    throw error; // Re-throw to handle in controller
  }
};
export const verifyEmailConfig = async () => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });
    
    await transporter.verify();
    console.log("✅ Email configuration verified successfully");
    return true;
  } catch (error) {
    console.error("❌ Email configuration error:", error.message);
    return false;
  }
};

// Removed duplicate export default statement
export default sendEmail