const Joi = require('joi');

exports.signupSchema = Joi.object({
    email: Joi.string()
        .email({ tlds: { allow: ['com', 'net'] } })
        .min(6)
        .max(60)
        .required(),
    password: Joi.string()
        .min(8)
        .required(),
});

exports.loginSchema = Joi.object({
    email: Joi.string()
        .email({ tlds: { allow: ['com', 'net'] } })
        .min(6)
        .max(60)
        .required(),
    password: Joi.string()
        .required(),
});

exports.acceptCodeSchema = Joi.object({
    email: Joi.string()
        .email({ tlds: { allow: ['com', 'net'] } })
        .min(6)
        .max(60)
        .required(),
    providedCode: Joi.number()
        .integer() 
        .required(),
});
