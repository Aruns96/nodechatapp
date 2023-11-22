const Sequelize=require('sequelize')
const sequelize=require('../utils/database')
const Group=sequelize.define('group',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:Sequelize.STRING,
        primaryKey:true,
        allowNull:false
    },
    name:Sequelize.STRING,
    adminId:Sequelize.INTEGER
})
module.exports=Group