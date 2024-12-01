const Joi = require('joi');

exports.signupSchema = Joi.object({
    email: Joi.string()
    .min(6)
    .max(60)
    .required()
    .email({tlds: {allow: ['com', 'net']},
    }),
    password:Joi.string()
    .required()
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*])[A-Za-z\\d!@#$%^&*]{8,}$'))
})

exports.loginSchema = Joi.object({
    email: Joi.string()
    .min(6)
    .max(60)
    .required()
    .email({tlds: {allow: ['com', 'net']},
    }),
    password:Joi.string()
    .required()
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*])[A-Za-z\\d!@#$%^&*]{8,}$'))
});

exports.acceptCodeSchema = Joi.object({
    email: Joi.string()
    .min(6)
    .max(60)
    .required()
    .email({tlds: {allow: ['com', 'net']},
    }),
    providedCode: Joi.number()
})