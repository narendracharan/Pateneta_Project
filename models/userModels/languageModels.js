const mongoose=require("mongoose")

const schema=new mongoose.Schema({
    language: {
        type: String,
      default:"Arabic"
      },
      deviceOs: {
        type: String,
        require: true,
      },
      device_Id: {
        type: String,
        required: true,
      },
})

schema.set("timestamps",true)
module.exports=mongoose.model("language",schema)