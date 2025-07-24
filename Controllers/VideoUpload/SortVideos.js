var Customer_Model = require('../../app/Model/users');
var Joi = require('@hapi/joi');
var Video_Model = require('../../app/Model/uploadvideos');
var fs = require('fs')
module.exports.sortVideos = async function sortVideos(req, res) {
    try {
        var params = req.body;
        if (params == undefined) {
            return res.json({ response: 0, message: "Please pass customer register data" })
        }
        var validateRegisterData = Joi.object({
            emailID: Joi.string().strict().email().required(),
            sort: Joi.string().strict().valid("ascending", "descending").optional().allow(""),
        })
        var result = await validateRegisterData.validate(params)
        if (result.error) {
            res.statusCode = 400;
            return res.json({ response: 0, message: result.error.details[0].message })
        }
        var CheckinguserID = await Customer_Model.findOne({ emailID: params.emailID }).exec();
        if (CheckinguserID) {
            if (params.sort == undefined || params.sort == "" || params.sort == "descending") {
                var videosFetchSort = await Video_Model.find({
                    emailID: params.emailID
                },{_id:0,__v:0}).sort({ videoViewCount: -1 }).exec()
            } else {
                var videosFetchSort = await Video_Model.find({
                    emailID: params.emailID
                },{_id:0,__v:0}).sort({ videoViewCount: 1 }).exec()
            }
            if (videosFetchSort.length > 0) {
                return res.json({
                    response: 3, message: "Sort data founded successfully",
                    sortVideosData: videosFetchSort
                })
            } else {
                return res.json({ response: 0, message: "No data found" })
            }

        } else {
            return res.json({
                response: 0, message: "This emailID data not found",
                
            })
        }
    } catch (error) {
        return res.json({ response: 0, message: error.message })
    }
}