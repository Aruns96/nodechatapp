const jwt = require("jsonwebtoken");
const User = require("../models/user");



exports.authorize = (req,res,next) => {
    try{
          const token = req.header("Authorization");
          const user = jwt.verify(token,"secretKey");
          User.findByPk(user.userId).then(user=>{
            req.user = user;
            next();
          }).catch(e=>{throw new Error(e)})
    }catch(e){
      return res.status(401).json({err:e});
    }
}