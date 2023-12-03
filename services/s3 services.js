
const AWS = require('aws-sdk')
require('dotenv').config();


const  uploadToS3 = (data, filename)=> {
  // permitions and where to save file
  return new Promise((resolve, reject) => {   
    const Bucketname = process.env.BUCKET_NAME
    const userKey = process.env.IAM_USER_KEY
    const userSeckretKey = process.env.IAM_SECRET_KEY

    // creating new instance of s3bucket
    const s3bucket = new AWS.S3({
      accessKeyId: userKey,
      secretAccessKey: userSeckretKey,
    });

    const params = {
      Bucket: Bucketname,
      Key: filename,
      Body: data.buffer,
      ACL: 'public-read'    // publicly readable
    };

    s3bucket.upload(params, (err, s3response) => {
      if (err) {
        console.error('Something went wrong:', err);
        reject(err);
      } else {
        console.log('Success:', s3response);
        console.log('###########3',s3response.Location)
        resolve(s3response.Location); // returning file url
      }
    });
  });
}

module.exports ={
    uploadToS3
}