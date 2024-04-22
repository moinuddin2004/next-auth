import nodemailer from "nodemailer";
import User from "@/models/user.model.mjs";
import bcrypt from "bcryptjs";
export async function sendEmail({ email, emailType, userId }: any) {
  try {
    console.log(email, emailType, userId);
    const hashedToken = await bcrypt.hash(userId.toString(), 10);
    console.log(hashedToken);
    console.log(userId);
    
    if (emailType == "VERIFY") {
     const updatedUser = await User.findOneAndUpdate(
       { _id: userId }, // Filter object
       {
         $set: {
           verifyToken: hashedToken,
           verifyTokenExpiry: new Date(Date.now() + 3600000),
         },
       },
       { new: true } // Options object to return the updated document
     );
console.log("updated user for verify", updatedUser);

    } else if (emailType == "FORGOT") {
      await User.findOneAndUpdate(userId, {
        $set: {
          forgotPasswordToken: hashedToken,
          forgotPasswordExpiry: new Date(Date.now() + 3600000),
        },
      });
    }

    const transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "bc2f039723289b",
        pass: "43240cb3ad74d4",
      },
    });

    const mailOptions = await transport.sendMail({
      from: "s.m.moin2004@gmail.com",
      to: email,
      subject:
        emailType == "VERIFY"
          ? "plz verify your email "
          : "confrim forgot password",
      text: "Hello world?", // plain text body
      html: `    <p>click <a href="${
        process.env.DOMAIN
      }/verifyemail?token=${hashedToken}"> here</a> to ${
        emailType == "VERIFY" ? "verify your email" : "reset your password"
      }</p>
      <p>or copy this link ${
        process.env.DOMAIN
      }/verifyemail?token=${hashedToken}</p>
`, // html body
    });
    const mailresponse = await transport.sendMail(mailOptions);
    return mailresponse;
  } catch (error: any) {
    throw new Error(error.message);
  }
}
