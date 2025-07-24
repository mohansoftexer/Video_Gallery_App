var Customer_Model = require('../../app/Model/users');
var Joi = require('@hapi/joi');
var Video_Model = require('../../app/Model/uploadvideos');
var fs = require('fs')
module.exports.UpdateVideoUpload = async function UpdateVideoUpload(req, res) {
    try {
        var params = JSON.parse(req.body.videodata);
        if (params == undefined) {
            return res.json({ response: 0, message: "Please pass customer register data" })
        }
        var validateRegisterData = Joi.object({
            emailID: Joi.string().strict().email().required(),
            videoUniqueID: Joi.string().strict().required(),
            title: Joi.string().strict().required(),
        })
        var result = await validateRegisterData.validate(params)
        if (result.error) {
            res.statusCode = 400;
            return res.json({ response: 0, message: result.error.details[0].message })
        }
        var CheckinguserID = await Customer_Model.findOne({ emailID: params.emailID }).exec();
        if (CheckinguserID) {
            console.log(req.file)
            var checking_videoID = await Video_Model.findOne({
                emailID: params.emailID,
                videoUniqueID: params.videoUniqueID
            }).exec();
            if (checking_videoID) {
                if (req.file != null) {
                    var uploadvideo = await Video_Model.updateOne({
                        emailID: params.emailID,
                        videoUniqueID: params.videoUniqueID
                    }, {
                        $set: {
                            title: params.title,
                            description: params.description,
                            videopath: "/UploadVideoFiles/" + req.file.filename,
                            filename: req.file.originalname
                        }
                    }

                    )
                    if (uploadvideo.modifiedCount > 0) {
                        var oldfile = "public"+checking_videoID.videopath
                        fs.unlink(oldfile,err=>{
                            if(err){
                                console.log(err)
                            }else{
                                console.log("file unlink success")
                            }
                        })
                        return res.json({ response: 3, message: "Video uploading updated successfully" })
                    } else {
                        return res.json({ response: 0, message: "Video uploading failure" })
                    }
                } else {
                    var uploadvideo = await Video_Model.updateOne({
                        emailID: params.emailID,
                        videoUniqueID: params.videoUniqueID
                    }, {
                        $set: {
                            title: params.title,
                            description: params.description

                        }
                    }
                    )
                    if (uploadvideo.modifiedCount > 0) {
                        return res.json({ response: 3, message: "Video uploading updated successfully" })
                    } else {
                        return res.json({ response: 0, message: "Video uploading failure" })
                    }
                }

            } else {
                return res.json({
                    response: 0,
                    message: "Video uniqueID data not found"
                })
            }



        } else {
            return res.json({ response: 0, message: "This emailID data not found" })
        }
    } catch (error) {
        return res.json({ response: 0, message: error.message })
    }
}