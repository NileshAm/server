const admin = require("firebase-admin");
const fs = require("fs");
const webpConverter = require("webp-converter");
const uuid = require("uuid");
const path = require("path");
require("dotenv").config();

const serviceAccount = require("../config/firebase.config.json");
serviceAccount.project_id = process.env.PROJECT_ID;
serviceAccount.private_key_id = process.env.PRIVATE_KEY_ID;
serviceAccount.private_key = process.env.PRIVATE_KEY;
serviceAccount.client_email = process.env.CLIENT_EMAIL;
serviceAccount.client_id = process.env.CLIENT_ID;
serviceAccount.auth_uri = process.env.AUTH_URI;
serviceAccount.token_uri = process.env.TOKEN_URI;
serviceAccount.auth_provider_x509_cert_url =
  process.env.AUTH_PROVIDER_X509_CERT_URL;
serviceAccount.client_x509_cert_url = process.env.CLIENT_X509_CERT_URL;

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "new-tech-ff9a5.appspot.com",
  });
  console.error("Firebase Initialized Succesfully");
} catch (err){
  console.error("Failed to initialize firebase\n"+err);

}

async function FirebaseUpload(imageData) {
  const fileName = uuid.v4();
  const fileType = "." + imageData.name.split(".")[1];

  const tempFilePath = `./temp/${fileName + fileType}`;
  fs.writeFileSync(tempFilePath, imageData.data);

  const webpTempFilePath = `./temp/${fileName}.webp`;

  const destinationPath = `Product-Images/${fileName}.webp`;

  try {
    await webpConverter.cwebp(tempFilePath, webpTempFilePath, "-q 80");
    const bucket = admin.storage().bucket();

    await bucket.upload(webpTempFilePath, {
      destination: destinationPath,
      metadata: {
        contentType: "image/webp",
      },
    });
    return {
      message: "Image (WebP) uploaded successfully!",
      error: "",
      code: 200,
    };
  } catch (err) {
    return {
      message: "Error during conversion and upload:",
      error: err,
      code: 500,
    };
  } finally {
    fs.unlinkSync(tempFilePath);
    fs.unlinkSync(webpTempFilePath);
  }
}

module.exports = {
  FirebaseUpload,
};
