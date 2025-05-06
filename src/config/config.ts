import dotenv from "dotenv";

dotenv.config();

const COGNITO = {
  apiVersion: process.env.AWS_API_VERSION,
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
};

const USERPOOL = {
  UserPoolId: process.env.AWS_USER_POOL_ID || "",
  ClientId: process.env.AWS_CLIENT_ID || "",
};

const S3 = {
  region: process.env.S3_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || "",
  },
};

const config = {
  cognito: COGNITO,
  userPool: USERPOOL,
  s3: S3,
  userPoolId: process.env.AWS_USER_POOL_ID || "",
  region: process.env.AWS_REGION,
  bucketName: process.env.S3_BUCKET_NAME || "",
  clientSecret: process.env.AWS_CLIENT_SECRET || "",
};

export default config;
