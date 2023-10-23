const nodemailer = require("nodemailer");
//const config = require("config");

const sendMail = async (
  to,
  subject,
  fullName_en,
  body,
  adminDocs,
  attachments
) => {
  const user = fullName_en === undefined ? "" : fullName_en.length ? fullName_en : "";
  const documents =
    adminDocs === undefined ? "" : adminDocs.length ? adminDocs : "";
  //   console.log(user);
  const transporter = nodemailer.createTransport({
   service:"gmail",
    // host: config.get("mailServerHost"),
    // port: config.get("mailPort"),
    //   secure: false,
    //   console: true,
    //   ignoreTLS: false,
    //   requireTLS: false,
    auth: {
        user:"s04450647@gmail.com",
        pass:"rpdncvlikrlckuip"
    },
  });
  //   console.log(config.get("mailServerPassword"));
  //   console.debug("From " + config.get("mailServerid"));
  //   console.debug("To " + to);
  //   console.debug("Subject " + subject);
  //   console.debug("Body " + body);

  var mailOptions = {
    from:"s04450647@gmail.com",
    to: to,
    subject: subject,
    text: body,
    html: `
    <body style="font-family: 'Poppins', sans-serif; margin: 0 auto;">
         <table width="600" style="margin: 0 auto; border: 0; border-spacing: 0;">
            <tr>
               <td style="padding: 0; background-color: #eef3ff; border-bottom: 6px solid #eb3237;">
                  <table width="100%" style="margin: 0 auto; border: 0; border-spacing: 0;">
                     <tr>
                        <td style="text-align: center; background-color: #3e4093; padding: 25px 30px 0;">
                           <table width="100%" style="margin: 0 auto; border: 0; border-spacing: 0;">
                              <tr>
                                 <td style="text-align: center; padding-bottom: 25px;">
                                    <span
                                       style="display: inline-block; background-color: #fff; border-radius: 10px; padding: 10px;">
                                       <img style="display: inline-block; max-width: 150px;"
                                          src="https://patenta-sa.com:2053/1698041746311hwbi3.png"
                                          alt="Patenta">
                                    </span>
                                 </td>
                              </tr>
                           </table>
                        </td>
                     </tr>
                     <tr>
                        <td style="padding: 30px;">
                           <table width="100%" style="margin: 0 auto; border: 0; border-spacing: 0;">
                              <tr>
                                 <td
                                    style="text-align: left; font-size: 14px;line-height: 24px;font-weight: 400; color: #000; padding-bottom: 25px;">
                                    Hi ${user}
                                 </td>
                              </tr>
                              <tr>
                                 <td
                                    style="text-align: left; font-size: 14px;line-height: 24px;font-weight: 400; color: #000; padding-bottom: 25px;">
                                    ${body}
                                 </td>
                              </tr>
                              <tr>
                                 <td
                                    style="text-align: left; font-size: 14px;line-height: 24px;font-weight: 400; color: #000; padding-bottom: 25px;">
                                    <div style="display: flex; flex-direction: row; justify-content: space-evenly;">
                                    ${documents}
                                    </div>
                                 </td>
                              </tr>
                              <tr>
                                 <td
                                    style="text-align: left; font-size: 14px;line-height: 24px;font-weight: 400; color: #000; padding-bottom: 25px;">
                                    If you have any questions or concerns regarding this, please do not hesitate to
                                    reach out to us at
                                    [<a href="mailto:websupport@Patenta.com">websupport@Patenta.com</a>].
                                 </td>
                              </tr>
                           </table>
                        </td>
                     </tr>
                  </table>
               </td>
            </tr>
         </table>
      </body>
    `,
  };
  if (attachments) mailOptions.attachments = attachments;

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.error("Exception", error);
      // return res.status(500).json({
      //   code: "SERVER_ERROR",
      //   description: "something went wrong, Please try again",
      //   error: error,
      // });
    } else {
      console.info("Email sent: " + info.response);
      // return res.status(200).json({
      //   message: "Notification sent by mail successfully",
      //   data: info.response,
      // });
    }
  });
};

module.exports = sendMail;
