const express = require('express');
const bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
const config = require('../config');

const User = require('../models/user');

var user_router = express.Router();

user_router.use(bodyParser.json());

user_router.post('/login', (req, res) => {
    User.findOne({name: req.body.name})
        .then((user) => {
            user.comparePassword(req.body.password, function(err, isMatch) {
                if (err) throw err;
                if (isMatch) {
                    var token = getToken({_id: user._id});
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({ sucess: true, token: token, status: 'You are successfully loggin!', user: {name: user.name} });
                } else {
                    res.statusCode = 404;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({ message: 'Mật khấu không đúng' });
                }
            });
        }).catch((err) => console.log(err));
});

getToken = function(user) {
    return jwt.sign(user, config.secretKey, {expiresIn: "2d"});
}

module.exports = user_router;