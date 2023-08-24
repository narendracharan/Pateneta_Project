const mongoose=require("mongoose")

const schema=new mongoose.Schema({
    subCategoryName:{
        type:String,
        require:true
    },
    subCategoryPic:{
        type:String,
        require:true
    },
    category_Id:{
        type:mongoose.Schema.Types.ObjectId,
       ref:"category"
    },
    user_Id:{
        category_Id:{
            type:mongoose.Schema.Types.ObjectId,
           ref:"admin"
        },  
    }
})

schema.set('timestamps',true)
module.exports=mongoose.model("subCategory",schema)