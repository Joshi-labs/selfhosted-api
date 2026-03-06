import express from "express";
import emailLock from "../middleware/emailLock.js";

const router = express.Router();

router.post("/email", emailLock, async (req, res) => {
  const { firstName, lastName, email, phone, message } = req.body;

  if (!firstName || !email || !message) {
    return res.status(400).json({
      code: 400,
      success: false,
      message: "Missing required fields"
    });
  }

  try {
    const response = await fetch(process.env.MAIL_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        to: "vpjoshi@proton.me",
        senderKey: "admin",
        verificationKey: process.env.MAIL_VERIFICATION_KEY,
        templateKey: "notifyme",
        templateData: {
          fromName: `${firstName} ${lastName || ""}`,
          fromEmail: email,
          message: `Phone: ${phone || "Not provided"}\n\n${message}`
        }
      })
    });

    if (!response.ok) {
      return res.status(500).json({
        code: 500,
        success: false,
        message: "Email service failed"
      });
    }

    // store sender IP for 24h
    markEmailSent(req.senderIP);

    return res.json({
      code: 200,
      success: true,
      message: "Email sent successfully"
    });

  } catch (error) {
    console.error("Email proxy error:", error);

    return res.status(500).json({
      code: 500,
      success: false,
      message: "Internal server error"
    });
  }
});

export default router;