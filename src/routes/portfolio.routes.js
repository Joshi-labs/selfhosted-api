import express from "express";
import emailLock from "../middleware/emailLock.js";

const router = express.Router();

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LIMITS = {
  firstName: 50,
  lastName: 50,
  email: 100,
  phone: 20,
  message: 2000
};

const EMAIL_HARD_LIMIT = 100;
let emailCounter = 0;

function validateEmailBody({ firstName, lastName, email, phone, message }) {
  if (!firstName || !email || !message) return "Missing required fields";
  if (firstName.length > LIMITS.firstName) return "First name too long";
  if (lastName && lastName.length > LIMITS.lastName) return "Last name too long";
  if (email.length > LIMITS.email || !EMAIL_REGEX.test(email)) return "Invalid email address";
  if (phone && phone.length > LIMITS.phone) return "Phone number too long";
  if (message.length > LIMITS.message) return `Message must be under ${LIMITS.message} characters`;
  return null;
}

router.post("/email", emailLock, async (req, res) => {
  const { firstName, lastName, email, phone, message } = req.body;

  const validationError = validateEmailBody({ firstName, lastName, email, phone, message });
  if (validationError) {
    return res.status(400).json({
      code: 400,
      success: false,
      message: validationError
    });
  }

  if (emailCounter >= EMAIL_HARD_LIMIT) {
    return res.status(503).json({
      code: 503,
      success: false,
      message: "Contact form is temporarily unavailable. Please reach out directly."
    });
  }

  emailCounter += 1;
  const currentCount = emailCounter;

  try {
    const response = await fetch(process.env.MAIL_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: "vpjoshi@proton.me",
        senderKey: "admin",
        verificationKey: process.env.MAIL_VERIFICATION_KEY,
        templateKey: "notifyme",
        templateData: {
          fromName: `${firstName} ${lastName || ""}`.trim(),
          fromEmail: email,
          message: `📬 Message #${currentCount} of ${EMAIL_HARD_LIMIT}\n\nPhone: ${phone || "Not provided"}\n\n${message}`
        }
      })
    });

    if (!response.ok) {
      emailCounter -= 1; // roll back on failure
      return res.status(500).json({
        code: 500,
        success: false,
        message: "Email service failed"
      });
    }

    return res.json({
      code: 200,
      success: true,
      message: "Email sent successfully"
    });

  } catch (error) {
    emailCounter -= 1; // roll back on failure
    console.error("Email proxy error:", error);
    return res.status(500).json({
      code: 500,
      success: false,
      message: "Internal server error"
    });
  }
});

export default router;