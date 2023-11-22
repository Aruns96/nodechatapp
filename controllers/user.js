const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

function generateToken(id){
    return jwt.sign({userId:id},"secretKey");
}

const postSignup = async(req,res)=>{
  
    try{
        const {name,email,phone,password} = req.body;
        
        if(name == undefined || name.length == 0 || email == undefined || email.length == 0 ||  phone == undefined || phone.length == 0 ||password == undefined || password.length == 0){
          return   res.status(400).json({err:"bad params"});
        }
        const user = await User.findOne({where:{email}});
        console.log(user)
        if(user){
            return res.status(205).json({message:"User Already Exists Please Login"})
        }
        else{
            bcrypt.hash(password,10, async(err,hash)=>{
                if(err){
                    throw new Error("something went wrong");
                }
                await User.create({name:name,email:email,phone:phone,password:hash});
                res.status(201).json({message:"Sucessfully Signed Up"});
            })
        }
       
        
       


    }catch(e){
        res.status(500).json({error:e});
    }
}

const postLogin = async(req,res)=>{
  
    try{
        const {email,password} = req.body;
        
        if( email == undefined || email.length == 0 || password == undefined || password.length == 0){
          return   res.status(400).json({err:"bad params"});
        }
        
        const user = await User.findAll({where:{email}});
       
        
        if(user.length > 0){
          bcrypt.compare(password,user[0].password,(err,result)=>{
            if(err){
                throw new Error("something went wrong")
            }
            if(result === true){
                return res.status(201).json({message:"user login succesfully",token:generateToken(user[0].id)});
               
            }else{
                return res.status(203).json({message:"password incorrect"})
            }
          })
            
            
           
           
        }else{
            return res.status(205).json({message:"user not found"})
        }

    }catch(e){
        res.status(500).json({error:e});
    }
}



module.exports ={postSignup,postLogin}