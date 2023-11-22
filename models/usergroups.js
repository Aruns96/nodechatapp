const Sequelize=require('sequelize')
const sequelize=require('../utils/database')
const UserGroup=sequelize.define('usergroup',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:Sequelize.STRING,
        primaryKey:true,
        allowNull:false
    }
    
})
module.exports=UserGroup