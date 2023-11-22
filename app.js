const express = require("express");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const sequelize = require("./utils/database")
const bodyParser = require("body-parser");
const userRoute = require("./routes/user");
const chatRoute = require("./routes/chat");
const groupRoute = require("./routes/group");

const User = require("./models/user");
const Msg = require("./models/message");
const Group = require("./models/group");
const UserGroup = require("./models/usergroups");

const cronService = require('./services/cron');
//cronService.job.start();



const app = express();
app.use(cors({
    origin:"*",
   
}));

app.use(express.static(path.join(__dirname,'public')));

const server = http.createServer(app);

//const io =  socketio(server);
const io = new Server(server, {
    cors: {
      origin:"*",
      credentials: true
    }
  });



app.use(bodyParser.json({extended:false}));
app.use("/user",userRoute);
app.use("/chat",chatRoute);
app.use("/group",groupRoute);


User.hasMany(Msg);
Msg.belongsTo(User);
User.belongsToMany(Group,{through:UserGroup});
Group.belongsToMany(User,{through:UserGroup});
Group.hasMany(Msg)
Msg.belongsTo(Group)



io.on("connection",socket=>{
  console.log("connect");
  socket.on('new-common-message', ()=> {
    socket.broadcast.emit('common-message',"new common message recieved");
})
socket.on('new-group-message', (groupId)=> {
    socket.broadcast.emit('group-message',groupId);
})
  
})


sequelize.sync().then((result)=>{
    server.listen(3000);
   }).catch(e=>console.log(e))