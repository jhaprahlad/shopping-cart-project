const AWS = require("aws-sdk");
const {
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_REGION,
} = require("../../config");

const fs = require("fs");

const uploadFiles = async (file) => {
  AWS.config.update({
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
    region: AWS_REGION,
  });

  const s3 = new AWS.S3({ apiVersion: "2006-03-01" });

  const uploadParams = {
    Bucket: "classroom-training-bucket",
    Key: "New_Files/" + file.originalname,
    Body: file.buffer,
    ACL: "public-read",
  };

  try {
    const data = await s3.upload(uploadParams).promise();
    return data.Location;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  uploadFiles,
};
