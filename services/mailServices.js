const nodemailer=require("nodemailer")

const transporter=nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:"s04450647@gmail.com",
        pass:"rpdncvlikrlckuip"
    }
})

module.exports={
    transporter
}   