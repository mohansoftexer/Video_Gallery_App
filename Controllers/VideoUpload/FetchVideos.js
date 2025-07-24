var Customer_Model = require('../../app/Model/users');
var Joi = require('@hapi/joi');
var Video_Model = require('../../app/Model/uploadvideos');
var fs = require('fs')
module.exports.FetchVideos = async function FetchVideos(req, res) {
    try {
        var params = req.body;
        if (params == undefined) {
            return res.json({ response: 0, message: "Please pass customer register data" })
        }
        var validateRegisterData = Joi.object({
            emailID: Joi.string().strict().email().required(),
            videoUniqueID: Joi.string().strict().required(),
            pageNo: Joi.number().integer().min(1).strict().required(),
            size: Joi.number().integer().min(1).strict().required(),
        })
        var result = await validateRegisterData.validate(params)
        if (result.error) {
            res.statusCode = 400;
            return res.json({ response: 0, message: result.error.details[0].message })
        }
        var CheckinguserID = await Customer_Model.findOne({ emailID: params.emailID }).exec();
        if (CheckinguserID) {
            var pageNo = params.pageNo;
            var size = params.size;
            if (params.videoUniqueID == "All") {
                var fetchvideosdataCount = await Video_Model.countDocuments({
                    emailID: params.emailID
                }).exec();
                var fetchvideosdata = await Video_Model.find({
                    emailID: params.emailID
                }, { _id: 0, __v: 0 }).skip((pageNo - 1) * size).limit(size);
                if (fetchvideosdata.length > 0) {
                    var totalpages = Math.ceil(fetchvideosdataCount / size)
                    return res.json({
                        response: 3,
                        message: "Videos data fetch successfully",
                        totalpages: totalpages,
                        videoData: fetchvideosdata
                    })
                } else {
                    return res.json({ response: 0, message: "No data found" })
                }

            } else {
                var fetchvideosdata = await Video_Model.find({
                    emailID: params.emailID,
                    videoUniqueID: params.videoUniqueID
                }, { _id: 0, __v: 0 }).exec()
                if (fetchvideosdata.length > 0) {
                    var VideoCountUpdate = await Video_Model.updateOne({
                        emailID: params.emailID,
                        videoUniqueID: params.videoUniqueID
                    },{$inc:{videoViewCount:1}}).exec()
                    console.log(VideoCountUpdate)
                    return res.json({
                        response: 3,
                        message: "Videos data fetch successfully",
                        totalpages: 0,
                        videoData: fetchvideosdata
                    })
                } else {
                    return res.json({ response: 0, message: "No data found" })
                }
            }




        } else {
            return res.json({ response: 0, message: "This emailID data not found" })
        }
    } catch (error) {
        return res.json({ response: 0, message: error.message })
    }
}