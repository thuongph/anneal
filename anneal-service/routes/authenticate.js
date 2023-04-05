var jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/user');

exports.verifyUser = (req, res, next) => {
    if (!req.headers.authorization) {
        res.statusCode = 401;
        res.json({message: 'Bạn chưa đăng nhập tài khoản người dùng'});
    }
    else {
        var token = req.headers.authorization.split(" ")[1];
        try {
            var decode = jwt.verify(token, config.secretKey).id;
        } catch(error) {
            res.statusCode = 401;
            res.json({message: 'Bạn chưa đăng nhập tài khoản người dùng'});
        }
        User.findById(decode).then((result) => {
            if (result?.length == 0) {
                res.statusCode = 401;
                res.json({message: 'Bạn chưa đăng nhập tài khoản người dùng'});
            } else {
                return next();
            }
        }, (err) => next(err))
        .catch(err => next(err));
    }
}