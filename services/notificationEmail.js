const nodemailer = require("nodemailer");
//const config = require("config");

const sendNotificationEmail = async (
  to,
  subject,
  name,
  message,
  body,
  adminDocs,
  attachments
) => {
  const description =
    message === undefined ? "" : message.length ? message : "";
  const user = name === undefined ? "" : name.length ? name : "";
  const documents =
    adminDocs === undefined ? "" : adminDocs.length ? adminDocs : "";
  //   console.log(user);
  const transporter = nodemailer.createTransport({
    service: "gmail.com",
    auth: {
      user: "s04450647@gmail.com",
      pass: "fwgz znds chrd mchw",
    },
    tls: {
      rejectUnauthorized: false, // This line trusts the self-signed certificate
    },
  });
  var mailOptions = {
    from: { name: "PATENTA", address: "s04450647@gmail.com" },
    to: to,
    subject: subject,
    text: body,
    html: `
    <head>
   <meta charset="utf-8" />
   <title>StarImpoters</title>
   <meta content="" name="description" />
   <meta content="" name="keywords" />
   <link rel="preconnect" href="https://fonts.googleapis.com">
   <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
   <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;600;700;800&display=swap"
      rel="stylesheet">
</head>
   <body style="font-family: 'Poppins', sans-serif; margin: 0;">
   <tr>
      <td style="border: 0;">
         <table width="900" style="margin: 60px auto; border: 0; border-spacing: 0;">
            <tr>
               <td style="padding: 50px 60px; background-color: #164262; display: flex;">
                  <table width="50%" style="border: 0; border-spacing: 0; height: 500px;">
                     <tr>
                        <td style="text-align: center; background-color: white; border-radius: 5px;">
                           <table width="100%" style="border: 0; border-spacing: 0;">
                              <tr>
                                 <td style="text-align: center;">
                                    <span
                                       style="display: inline-block; background-color: #fff; border-radius: 10px; padding: 8px ; border: 2px solid #164262;">
                                       <img
                                          style="display: inline-block; max-width: 120px; border-radius: 5px; box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;"
                                          src="http://ec2-16-24-2-241.me-south-1.compute.amazonaws.com:2053/1719216187747y4j7x.png" alt="">
                                    </span>
                                 </td>
                              </tr>
                              <tr>
                                 <td style="text-align: center; padding-top: 20px;">
                                    <span
                                       style="display: inline-block; background-color: #fff; border-radius: 10px; padding: 5px ;">
                                       <img
                                          style="display: inline-block; max-width: 250px; max-height: 200px; border-radius: 5px;"
                                          src="http://ec2-16-24-2-241.me-south-1.compute.amazonaws.com:2053/1719216258514j57gv.png" alt="" >
                                    </span>
                                 </td>
                              </tr>
                              <tr>
                                 <td style="text-align: center; padding-top: 50px;">
                                    <a href="" style="display: inline-block; border-radius: 10px; padding: 8px ;">
                                       <img style="display: inline-block; max-width: 120px; border-radius: 5px;"
                                          src="http://ec2-16-24-2-241.me-south-1.compute.amazonaws.com:2053/17192163068517nixw.png" alt="">
                                    </a>
                                    <a href="" style="display: inline-block; border-radius: 10px; padding: 8px ;">
                                       <img style="display: inline-block; max-width: 120px; border-radius: 5px;"
                                          src="http://ec2-16-24-2-241.me-south-1.compute.amazonaws.com:2053/1719216337365c90ir.png" alt="">
                                    </a>
                                    <a href="" style="display: inline-block; border-radius: 10px; padding: 8px ;">
                                       <img style="display: inline-block; max-width: 120px; border-radius: 5px;"
                                          src="http://ec2-16-24-2-241.me-south-1.compute.amazonaws.com:2053/1719216362335drvf4.png" alt="">
                                    </a>
                                    <a href="" style="display: inline-block; border-radius: 10px; padding: 8px ;">
                                       <img style="display: inline-block; max-width: 120px; border-radius: 5px;"
                                          src="http://ec2-16-24-2-241.me-south-1.compute.amazonaws.com:2053/1719216395736gnudu.png" alt="">
                                    </a>
                                 </td>
                              </tr>
                           </table>
                        </td>
                     </tr>
                  </table>
                  <table width="50%"  style="border: 0; border-spacing: 0; height: 400px;margin: 50px auto;">
                     <tr>
                        <td
                           style="text-align: left; background-color: white; padding: 15px 20px 0; border-radius: 0px 5px 5px 0px;">
                           <table width="50%" style="border: 0; border-spacing: 0;">
                              <tr>
                                 <td
                                    style="text-align: left; font-size: 20px; color:#164262; font-weight: 600; padding-bottom: 25px;">
                                    <label>Title</label>
                                   <textarea name="" id="" rows="1" cols="38" style="border-radius: 2px;">${user}</textarea>
                                 </td>
                              </tr>
                              <tr>
                                 <td
                                    style="text-align: left; font-size: 20px; color:#164262; font-weight: 600; padding-bottom: 20px;">
                                    <label>Discription</label>
                                    <textarea name="" id="" rows="8" cols="38" style="border-radius: 2px;">${description}</textarea>
                                 </td>
                              </tr>
                              <tr>
                                 <td style="text-align: center;">
                                    <a href="https://patenta-sa.com/" target="_blank"
                                       style="background-color: #164262;  color:white; padding: 8px 26px; font-size: 16px; font-weight: 500;border-radius: 5px; cursor: pointer; box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;">Go
                                       to website</a>
                                 </td>
                              </tr>
                           </table>
                        </td>
                     </tr>
                  </table>
               </td>
            </tr>
         </table>
      </td>
   </tr>
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

module.exports = sendNotificationEmail;
