var express = require('express');
var router = express.Router();

router.post('/register', (req, res) => {
var Customer_Register = require('../Controllers/Customers/CustomerRegister');
Customer_Register.Customer_Register(req,res)
})
router.post('/login', (req, res) => {
var Customer_Login = require('../Controllers/Customers/CustomerLogin');
Customer_Login.Customer_Login(req,res)
})

module.exports = router;