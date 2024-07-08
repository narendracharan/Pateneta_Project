require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
const fs = require("fs");
const path = require("path");
const cookieParser = require("cookie-parser");
 //const helmet = require("helmet");
// const {Server}=require("socket.io")
// const io=new Server()
const bodyparser = require("body-parser");
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
app.use(cors());
var allowlist = [
  "https://patenta-sa.com",
  "https://admin.patenta-sa.com",
  "http://localhost:3001",
  "http://localhost:3000",
];
var corsOptionsDelegate = function (req, callback) {
  var corsOptions;
  if (allowlist.indexOf(req.header("Origin")) !== -1) {
    corsOptions = { origin: true }; // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false }; // disable CORS for this request
  }
  callback(null, corsOptions); // callback expects two parameters: error and options
};
app.use(cookieParser());
app.use(bodyparser.urlencoded({ extended: false }));

app.use(bodyparser.json());
app.use(morgan("tiny"));
require("./config/connection");
const router = require("./routes/userRoutes");
const adminRouter = require("./routes/adminRoutes");
const {
  getMessages,
  sendMessage,
} = require("./controllers/userControllers.js/chatControllers");
const csurf = require("csurf");

process.env["BASE_URL"] = "https://ec2-16-24-2-241.me-south-1.compute.amazonaws.com:2053";

app.use(express.static("./public"));
app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  res.setHeader("Surrogate-Control", "no-store");
  //res.setHeader("X-Frame-Options", "SAMEORIGIN", "DENY");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  next();
});

// app.use(
//   helmet.contentSecurityPolicy({
//     directives: {
//       "x-content-type-options": ["nosniff"],
//       "frame-ancestors": ["'self'"],
//     },
//   })
// );

// app.use(
//   helmet({
//     xssFilter:true,
//     frameguard: {
//       action: "deny",
//     },
//   })
// );
app.use(cookieParser());
// CSRF protection middleware
const csrfProtection = csurf({ cookie: true });
// Routes
app.get("/form", csrfProtection, (req, res) => {
  // Pass the csrfToken to the view
  const csrfToken = req.csrfToken();
  console.log('Generated CSRF Token:', csrfToken);
  res.send(`<form action="/process" method="POST">
              <input type="hidden" name="_csrf" value="${req.csrfToken()}">
              <button type="submit">Submit</button>
            </form>`);
});
app.post("/process", csrfProtection, (req, res) => {
  
  res.send("Form processed");
});

// app.use((req, res, next) => {
//   const forbiddenMethods = [
//     "PROPFIND",
//     "PROPPATCH",
//     "MKCOL",
//     "COPY",
//     "MOVE",
//     "LOCK",
//     "UNLOCK",
//   ];
//   if (forbiddenMethods.includes(req.method)) {
//     return res.status(405).send("Method Not Allowed");
//   }
//   next();
// });
// app.use(
//   morgan("common", {
//     stream: fs.createWriteStream(path.join(__dirname, "access.log"), {
//       flags: "a",
//     }),
//   })
// );

// app.use(
//   morgan("common", {
//     skip: function (req, res) {
//       return res.statusCode < 400;
//     },
//     stream: fs.createWriteStream(path.join(__dirname, "error.log"), {
//       flags: "a",
//     }),
//   })
// );

//----> User Routes
app.use("/user", router);

//----> Admin Routes
app.use("/admin", adminRouter);

app.get("/", (req, res) => {
  console.log("Welcome to Patenta");
  res.status(200).send("Welcome to Patenta");
});

app.get("/success", function (req, res) {
  res.sendFile(__dirname + "/views.html");
  // res.send()
});

///---------------> Socket.io Connection

io.on("connection", async (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);

  const Message = await getMessages();
  io.emit("allMessageList", Message);

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

server.listen(process.env.PORT, () => {
  console.log(`Server is running port no:${process.env.PORT}`);
});
