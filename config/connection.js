const mongoose=require("mongoose")

const local="mongodb://127.0.0.1:27017/Patenta"
const db="mongodb+srv://narendracharan257538:jwvd0y0iMQthnnTL@cluster0.2miiukh.mongodb.net/test"
mongoose
  .connect(db)
  .then(() => {
    console.log("Successfully connected to mongoDB");
  })
  .catch((err) => {
    console.log(err);
  });
