require("dotenv").config()
const express=require("express")
const morgan=require("morgan")
const cors=require("cors")
const app=express()
const bodyparser=require("body-parser")
app.use(cors())
app.use(bodyparser.json())
require("./config/connection")
const router=require("./routes/userRoutes")
const adminRouter=require("./routes/adminRoutes")
process.env["BASE_URL"] = "http://ec2-3-110-182-243.ap-south-1.compute.amazonaws.com:2053";
app.use(express.static("./public"))
app.use("/user",router)
app.use("/admin",adminRouter)

app.get("/", (req, res) => {
    console.log("Welcome to Patenta");
    res.status(200).send("Welcome to Patenta");
  });

app.listen(process.env.PORT,()=>{
    console.log(`Server is running port no:${process.env.PORT}`);
})