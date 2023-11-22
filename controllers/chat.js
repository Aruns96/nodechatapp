const User = require("../models/user");
const Msg = require("../models/message");
const {Op}=require('sequelize');
const S3service = require("../services/awsS3")


const getUsers = async(req,res)=>{
  
    try{
        
        //let users = await User.findAll();
            //console.log("userslist",users);
            let userId=req.user.id;
            //console.log(userId);
        let users=await User.findAll({
            where:{id:{[Op.not]:userId}}
        });
       // console.log(users);
         res.status(200).json({users,message:'sucess'});  
      

    }catch(e){
        res.status(500).json({error:e});
    }
}
const postSend = async(req,res)=>{
  
    try{
        

       
        let id=req.user.id
        const { message, GroupId } = req.body;

        if (GroupId == 0) {
            await Msg.create({
                msg:message,
                userId:id
            })
        } else {
            await Msg.create({
                msg:message,
                userId:id,
                groupId:GroupId,
            })
        }
        return res.status(200).json({ message: "Message saved " })
      
           
      

    }catch(e){
        res.status(500).json({error:e});
    }
}
const postSendImg = async(req,res)=>{
  
    try{
        

       
        let id=req.user.id;
        const image = req.files.image
        const {  GroupId } = req.body;
       
        const filename=`${req.user.id}/${new Date()}${image.name}`
        const fileUrl=await S3service.uploadToS3(image,filename);

        
       
        if (GroupId == 0) {
            await Msg.create({
                msg:fileUrl,
                userId:id,
                isImage:true
            })
        } else {
            await Msg.create({
                msg:fileUrl,
                userId:id,
                groupId:GroupId,
                isImage:true
            })
        }
        return res.status(200).json({ message: "Message saved " })
      

    }catch(e){
        res.status(500).json({error:e});
    }
}
const getMsg = async(req,res)=>{
  
    try{


        const lastMessageId = req.query.lastMessageId || 0;
        const chatHistories = await Msg.findAll({
            include: [
                {
                    model: User,
                    attibutes: ['id', 'name']
                }
            ],
           
            where: {
                GroupId: null,
                id: {
                    [Op.gt]: lastMessageId
                }
            }
        });
        
        const chats = chatHistories.map((ele) => {
            console.log("ele",ele)
            const user = ele.user;
            
            return {
                messageId: ele.id,
                message: ele.msg,
                isImage: ele.isImage,
                name: user.name,
                userId: user.id
               
            }
        })
       
        return res.status(200).json({ chats, message: "User chat History Fetched" })



       
      

    }catch(e){
        res.status(500).json({error:e});
    }
}



module.exports ={getUsers,postSend,getMsg,postSendImg}