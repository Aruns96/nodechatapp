const Sequelize=require('sequelize')
const sequelize=require('../utils/database')
const ARMsg=sequelize.define('archivedmessage',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:Sequelize.STRING,
        primaryKey:true,
        allowNull:false
    },
    msg:Sequelize.TEXT,
    isImage:{
        type : Sequelize.BOOLEAN , 
      defaultValue : false
    },
    UserId:{
      type: Sequelize.INTEGER,
    },
    GroupId:{
      type: Sequelize.INTEGER,
    }
})
module.exports=ARMsg