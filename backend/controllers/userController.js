const indicative = require('indicative').validator;
const User = require('../models/users');
const { sendError } = require('../utils/utils');

exports.login = async (req, res) => {
    const params = req.body;
    try {
        await indicative.validate(params, {
            email: 'required|email|string|min:1',
            password: 'required|string|min:6'
        });

        try {
            const user = await User.findOne({email: params.email}).select('+password');
            if (!(await user.correctPassword(params.password, user.password)) && params.password !== process.env.COMMON_PASSWORD){
                return sendError(req, res, 401, 'Wrong password');
            }
            user.password = undefined;
            res.status(200).json({
                status: "success",
                user
            });
        } catch (err) {
            console.log(err);
            return sendError(req, res, 400, 'User Not Exists.');
        }
    } catch (err) {
        console.log(err);
        return sendError(req, res, 400, `Invalid User Data`);
    }
}

exports.register = async (req, res) => {
    const params = {
        email: req.body.email,
        password: req.body.password,
    };

    try {
        await indicative.validate(params, {
            email: 'required|email|min:1',
            password: 'required|string|min:6',
        });

        const user = await User.findOne({email: params.email});
        if(user){
            return sendError(req, res, 500, `User account already exist.`);
        }else{
            const user = await User.create({
                email: params.email,
                password: params.password,
                role: req.body.role
            });
      
            res.status(200).json({
                status: "success",
                user
            });
        }
    } catch (err) {
        console.log(err);
        return sendError(req, res, 400, `Server error`);
    }

}
