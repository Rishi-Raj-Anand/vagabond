const Joi = require('joi');

const listingValidation=Joi.object({
    listing:Joi.object({
        title:Joi.string().min(3).max(50).required(),
        description:Joi.string().max(200).required(),
        image:Joi.string().allow("",null),
        price:Joi.number().min(0).required(),
        location:Joi.string().min(3).max(50).required(),
        country:Joi.string().min(3).max(50).required(),

    }).required()
})

module.exports=listingValidation;