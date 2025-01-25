const { Address } = require("../models/address.model");


exports.createAddress = async(request,response)=>{
    try {
        const userId = request.user._id //auth middleware
        const { address_line , city, state, country,mobile } = request.body

        const createAddress = new Address({
            address_line,
            city,
            state,
            country,
            mobile,
            userId : userId 
        })
        const saveAddress = await createAddress.save()

        return response.json({
            message : "Address Created Successfully",
            error : false,
            success : true,
            data : saveAddress
        })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

exports.getAddress = async(request,response)=>{
    try {
        const userId = request.user._id // middleware auth

        const data = await Address.find({ userId : userId }).sort({ createdAt : -1})

        return response.json({
            data : data,
            message : "List of address",
            error : false,
            success : true
        })
    } catch (error) {
        return response.status(500).json({
            message : error.message || error ,
            error : true,
            success : false
        })
    }
}

exports.updateAddress = async(request,response)=>{
    try {
        const userId = request.user._id // middleware auth 
        const { _id, address_line,city,state,country, mobile } = request.body 

        const updateAddress = await Address.updateOne({ _id : _id, userId : userId },{
            address_line,
            city,
            state,
            country,
            mobile,
    
        })

        return response.json({
            message : "Address Updated",
            error : false,
            success : true,
            data : updateAddress
        })
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

exports.deleteAddress = async(request,response)=>{
    try {
        const userId = request.user._id // auth middleware    
        const { _id } = request.body 

        const disableAddress = await Address.updateOne({ _id : _id, userId},{
            status : false
        })

        return response.json({
            message : "Address remove",
            error : false,
            success : true,
            data : disableAddress
        })
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}
