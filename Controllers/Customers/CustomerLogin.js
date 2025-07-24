var Customer_Model = require('../../app/Model/users');
var Joi = require('@hapi/joi');
var brycpt = require('bcrypt');
var JwtToken = require('jsonwebtoken')
module.exports.Customer_Login = async function Customer_Login(req, res) {
    try {
        var params = req.body;
        if (params == undefined) {
            return res.json({ response: 0, message: "Please pass customer login data" })
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
        var CheckinguserID = await Customer_Model.findOne({ emailID: params.emailID },{_id:0,__v:0}).exec();
        if (CheckinguserID) {
            var Checking_oldpassword_and_currentpassword = brycpt.compare(params.password, CheckinguserID.password);
            if (Checking_oldpassword_and_currentpassword) {
                var token = JwtToken.sign({ emailID: params.emailID },
                    process.env.SECRET_KEY,
                    //{ expiresIn: '1h' }
                )
                return res.json({
                    response: 3, message: "Login sucessfully",
                    userData: CheckinguserID,
                    token
                })
            } else {
                return res.json({ response: 0, message: "password is wrong" })
            }
        } else {
            return res.json({ response: 0, message: "This user not register, Please Register" })
        }
    } catch (error) {
        return res.json({ response: 0, message: error.message })
    }
}