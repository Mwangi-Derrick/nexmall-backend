const { deleteImageCloudinary } = require("../utils/cloudinary");

const deleteImageController = async (request, response) => {
    
    try {
        const url = request.query.url
        const deleteImage = await deleteImageCloudinary(url);

        return response.json({
            message : "delete done",
            data : deleteImage,
            success : true,
            error : false
        })
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

module.exports = deleteImageController