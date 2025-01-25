const cloudinary = require("cloudinary").v2;
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

exports.uploadImageCloudinary = async(image)=>{
  const buffer = image?.buffer || Buffer.from(await image.arrayBuffer())

  const uploadImage = await new Promise((resolve,reject)=>{
      cloudinary.uploader.upload_stream({ folder : "nexmall"},(error,uploadResult)=>{
          return resolve(uploadResult)
      }).end(buffer)
  })

  return uploadImage
}
exports.deleteImageCloudinary = async (url) => {
  const publicId = url.split("/").slice(-2).join("/").split(".").slice(-2, -1)[0];
  await cloudinary.uploader.destroy(publicId);
}

