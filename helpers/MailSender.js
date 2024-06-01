import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendMail = async (email, verifyToken) => {
  try {
    return await sgMail.send({
      to: email,
      from: process.env.EMAIL_SENDER,
      subject: "Email Verification",
      html: `To verify your email click on the <a href="http://localhost:${process.env.PORT}/api/users/verify/${verifyToken}">link</a>`,
      text: `To verify your email open the link http://localhost:${process.env.PORT}/api/users/verify/${verifyToken}`,
    });
  } catch (error) {
    throw error;
  }
};

export default sendMail;
