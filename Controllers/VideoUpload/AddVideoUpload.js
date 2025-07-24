var Customer_Model = require('../../app/Model/users');
var Joi = require('@hapi/joi');
var Video_Model = require('../../app/Model/uploadvideos')
module.exports.AddVideoUpload = async function AddVideoUpload(req, res) {
    try {
        var params = JSON.parse(req.body.videodata);
        if (params == undefined) {
            return res.json({ response: 0, message: "Please pass customer register data" })
        }
        var validateRegisterData = Joi.object({
            emailID: Joi.string().strict().email().required(),
            title: Joi.string().strict().required(),
        })
        var result = await validateRegisterData.validate(params)
        if (result.error) {
            res.statusCode = 400;
            return res.json({ response: 0, message: result.error.details[0].message })
        }
        var CheckinguserID = await Customer_Model.findOne({ emailID: params.emailID }).exec();
        if (CheckinguserID) {
            // console.log(req)
            if (req.file != null) {
                console.log(req.file)
                var uploadvideo = await Video_Model.insertMany([{
                    videoUniqueID: "VID@" + new Date().getTime().toString(),
                    emailID: params.emailID,
                    title: params.title,
                    videopath: "/UploadVideoFiles/" + req.file.filename,
                    filename: req.file.originalname
                }])
                if (uploadvideo.length > 0) {
                    return res.json({ response: 3, message: "Video uploaded successfully" })
                } else {
                    return res.json({ response: 0, message: "Video uploaded failure" })
                }
            } else {
                return res.json({ response: 0, message: "please upload video" })
            }

        } else {
           return res.json({ response: 0, message: "This emailID data not found" })
        }
    } catch (error) {
        return res.json({ response: 0, message: error.message })
    }
}