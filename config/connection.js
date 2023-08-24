const mongoose=require("mongoose")

const local="mongodb://127.0.0.1:27017/Patenta"
mongoose
  .connect(local)
  .then(() => {
    console.log("Successfully connected to mongoDB");
  })
  .catch((err) => {
    console.log(err);
  });
