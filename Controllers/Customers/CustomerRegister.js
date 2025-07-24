var Customer_Model = require('../../app/Model/users');
var Joi = require('@hapi/joi');
var brycpt = require('bcrypt')
module.exports.Customer_Register = async function Customer_Register(req, res) {
    try {
        var params = req.body;
        if (params == undefined) {
            return res.json({ response: 0, message: "Please pass customer register data" })
        }
        var validateRegisterData = Joi.object({
            emailID: Joi.string().strict().email().required(),
            password: Joi.string().strict().required()
        })
        var result = await validateRegisterData.validate(params)
        if (result.error) {
            res.statusCode = 400;
            return res.json({ response: 0, message: result.error.details[0].message })
        }
        var CheckinguserID = await Customer_Model.findOne({ emailID: params.emailID }).exec();
        if (!CheckinguserID) {
            var Generate_hash_password = brycpt.hash(params.password, 10, async (err, hash) => {
                if (err){
                    return res.json({response:0,message:"Something went to wrong"})
                }
                var Register_New_User = await Customer_Model.insertMany([{
                    userUniqueID: "UID@" + new Date().getTime().toString(),
                    emailID: params.emailID,
                    password: hash
                }])
                if (Register_New_User.length > 0) {
                    return res.json({ response: 3, message: "Signup is successfully completed" })
                } else {
                    return res.json({ response: 0, message: "Signup is failure" })
                }
            });


        } else {
            return res.json({ response: 0, message: "This emailID already used, Please Register different emailID" })
        }
    } catch (error) {
        return res.json({ response: 0, message: error.message })
    }
}