const { CronJob } = require('cron');
const {Op} = require('sequelize');
const Msg = require('../models/message');
const ARMsg = require('../models/archivemessage');
exports.job = new CronJob(
    '0 0 * * *', 
    function () {
        archiveOldRecords();
    },
    null,
    false,
    'Asia/Kolkata'
);

async function archiveOldRecords() {
    try {
      const  day = new Date();
      day.setDate(day.getDate() - 1);
      
      const msgToArchive = await Msg.findAll({
        where: {
            createdAt: {
            [Op.lt]: day,
          },
        },
      });
     
     
      await Promise.all(
        msgToArchive.map(async (msgs) => {
            
          await ARMsg.create({
            id: msgs.id,
            msg: msgs.msg,
            isImage:msgs.isImage,
            UserId: msgs.userId,
            GroupId: msgs.groupId
          });
          await msgs.destroy();
        })
      );
      console.log("messages archeived");
    } catch (error) {
      console.log( error);
    }
  }

