var Customer_Model = require('../../app/Model/users');
var Joi = require('@hapi/joi');
var Video_Model = require('../../app/Model/uploadvideos');
var fs = require('fs')
module.exports.filtervideos = async function filtervideos(req, res) {
    try {
        var params = req.body;
        if (params == undefined) {
            return res.json({ response: 0, message: "Please pass customer register data" })
        }
        var validateRegisterData = Joi.object({
            emailID: Joi.string().strict().email().required(),
            minViewsCount: Joi.number().integer().strict().required(),
            maxViewsCount: Joi.number().integer().strict().required(),
        })
        var result = await validateRegisterData.validate(params)
        if (result.error) {
            res.statusCode = 400;
            return res.json({ response: 0, message: result.error.details[0].message })
        }
        var CheckinguserID = await Customer_Model.findOne({ emailID: params.emailID }).exec();
        if (CheckinguserID) {

            var videosFetchSort = await Video_Model.find({
                emailID: params.emailID,
                videoViewCount: { $gte: params.minViewsCount, $lte: params.maxViewsCount }
            });
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