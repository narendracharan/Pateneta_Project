const mongoose=require("mongoose")
const jwt=require("jsonwebtoken")

const schema=new mongoose.Schema({
    fullName_en:{
        type:String,
        require:true
    },
    fullName_ar:{
        type:String,
        require:true
    },
    Email:{
        type:String,
        require:true
    },
    mobileNumber:{
        type:String,
        require:true
    },
    profile:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    companyName_en:{
        type:String,
        require:true
    },
    companyName_ar:{
        type:String,
        require:true
    },
   docFile:{
    type:String,
    require:true
   },
   IdNumber:{
    type:Number,
    require:true
   },
   companyNumber:{
    type:Number,
    require:true
   },
   otp:{
    type:Number,
    require:true
   },
   otpExpriTime:{
  type:Date
   },
   userVerify:{
    type:String,
    enum:["PENDING", "APPROVED", "REJECTED"],
    default:"PENDING"
   },
   type: {
    type: String,
    enum: ["Admin","User"],
  },
  commission:{
    type:Number
  }
  
},
);
schema.methods.generateAdminAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, "ultra-security", {
      expiresIn: "365d",
    });
    return token;
  };
schema.set("timestamps", true);
module.exports = mongoose.model("user", schema);

