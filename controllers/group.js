const User = require("../models/user");
const Msg = require("../models/message");
const Group = require("../models/group");
const UserGroup = require("../models/usergroups")
const {Op}=require('sequelize')





const postCreate = async(req,res)=>{
  
    try{

        const user = req.user;
        const { name,  membersIds } = req.body;
        const group = await user.createGroup({
            name,
           
            adminId: user.id
        })
        membersIds.push(user.id);
        await group.addUsers(membersIds.map((ele) => {
            return Number(ele)
        }));
        return res.status(200).json({ group, message: "Group is succesfylly created" })


    }catch(e){
        res.status(500).json({error:e});
    }
}


const edit=async(req,res,next)=>{
    try{
     
        const user = req.user;
        const { groupId } = req.query;
        const group = await Group.findOne({ where: { id: Number(groupId) } });
        const { name, membersIds } = req.body;
        const updatedGroup = await group.update({
            name,
            adminId: user.id
        })
        membersIds.push(user.id);
        await updatedGroup.setUsers(null);
        await updatedGroup.addUsers(membersIds.map((ele) => {
            return Number(ele)
        }));
        return res.status(200).json({ updatedGroup, message: "Group is succesfylly updated" })


       
    }
    catch(error){
        console.log(error)
        res.status(500).json({message:error})
    }
}




const getGroupMembersbyId=async(req,res,next)=>{
    try{
      

        const { groupId } = req.query;
        const group = await Group.findOne({ where: { id: Number(groupId) } });
        const AllusersData = await group.getUsers();
        const users = AllusersData.map((ele) => {
            return {
                id: ele.id,
                name: ele.name,
            }
        })

        res.status(200).json({ users, message: "Group members name succesfully fetched" })
    

    }
    catch(error){
        console.log(error)
        res.status(500).json({message:error})
    }
}
const getGroupbyId=async(req,res,next)=>{
    try{
      

        const { groupId } = req.query;
        const group = await Group.findOne({ where: { id: Number(groupId) } });
        res.status(200).json({ group, message: "Group details succesfully fetched" })


    }
    catch(error){
        console.log(error)
        res.status(500).json({message:error})
    }
}
const getCurrentUser=async(req,res,next)=>{
    try{
      
        const user = req.user;
        res.json({ userId: user.id ,user});

    }
    catch(error){
        console.log(error)
        res.status(500).json({message:error})
    }
}

const getGroupMessages=async(req,res,next)=>{
    try{
      
        const { groupId } = req.query;
        const msg = await Msg.findAll({
            include: [
                {
                    model: User,
                    attibutes: ['id', 'name']
                }
            ],
            
            where: {
                GroupId: Number(groupId),
            }
        });
        const chats = msg.map((ele) => {
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

     

    }
    catch(error){
        console.log(error)
        res.status(500).json({message:error})
    }
}

const getMygroups=async(req,res,next)=>{
    try{
      
        const user = req.user;
        const groups = await user.getGroups();
        return res.status(200).json({ groups, message: "All groups succesfully fetched" })

    }
    catch(error){
        console.log(error)
        res.status(500).json({message:error})
    }
}
module.exports ={postCreate,edit ,getGroupMembersbyId,getGroupbyId,getCurrentUser,getGroupMessages,getMygroups}