const Joi=require('joi')

const reviewValidation=Joi.object({
    review:Joi.object({
        likes:Joi.number().min(1).max(5).required(),
        comment:Joi.string().required()
    }).required()
})

module.exports=reviewValidation;