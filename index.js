require("dotenv").config()
const express=require("express")
const morgan=require("morgan")
const cors=require("cors")
const app=express()
// const http=require("http")
// const server=http.createServer(app)
// const {Server}=require("socket.io")
// const io=new Server()
const bodyparser=require("body-parser")
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
app.use(cors())
app.use(bodyparser.json())
require("./config/connection")
const router=require("./routes/userRoutes")
const adminRouter=require("./routes/adminRoutes")
const { getMessages, sendMessage } = require("./controllers/userControllers.js/chatControllers")
process.env["BASE_URL"] = "https://patenta-sa.com:2053";
app.use(express.static("./public"))
// app.set("views", __dirname + "views");
// app.set("view engine", "ejs");
//----> User Routes
app.use("/user",router)

//----> Admin Routes
app.use("/admin",adminRouter)

app.get("/", (req, res) => {
    console.log("Welcome to Patenta");
    res.status(200).send("Welcome to Patenta");
  });

  app.get('/success',function(req, res) {
    res.sendFile(__dirname + '/views.html');
   // res.send()
});
io.on("connection", async (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);
  // socket.on("sendNotification", (data) => {
  //   socket.broadcast.emit("getNotification", data);
  // });
  socket.on("createRoom", async (chatId) => {
    console.log("createRoom", chatId);
    socket.join(chatId);
    const messages = await getMessages(chatId);
    io.to(chatId).emit("messageList", messages);
  });
  socket.on("sendMessage", async (data) => {
    console.log("sendMessage", data);
    const messages = await sendMessage(data);
    io.to(data.chatId).emit("messageList", messages);
  }); 
  socket.on("disconnect", () => {
    socket.disconnect();
    console.log("🔥: A user disconnected");
  });
});
server.listen(process.env.PORT,()=>{
    console.log(`Server is running port no:${process.env.PORT}`);
})