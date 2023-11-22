const Sequelize=require('sequelize')
const sequelize=require('../utils/database')
const Msg=sequelize.define('message',{
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
    }
})
module.exports=Msg