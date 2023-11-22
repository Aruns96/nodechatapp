const AWS=require('aws-sdk')
const uploadToS3=(file,filename)=>{
    const BUCKET=process.env.BUCKET
    const IAM_USER_KEY=process.env.IAM_USER_KEY
    const IAM_USER_SECRET=process.env.IAM_USER_SECRET
    let s3bucket=new AWS.S3({
        accessKeyId:IAM_USER_KEY,
        secretAccessKey:IAM_USER_SECRET
    })   
    console.log(file)
    let base64data = Buffer.from(file.data, 'binary')

    let params={
        Bucket:BUCKET,
        Key:filename,
        Body:base64data,
        ACL:'public-read'
    }
    return new Promise((resolve,reject)=>{
        s3bucket.upload(params,(err,res)=>{
            if(err){
                console.log('Something WEnt Wrong',err)
                reject(err)
            }
            else{
                console.log('Success',res)
                resolve(res.Location)
            }
        })
    })

}
module.exports={uploadToS3}