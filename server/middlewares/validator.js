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