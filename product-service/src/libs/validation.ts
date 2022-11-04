import * as Joi from 'joi';

export const create = Joi.object().keys({
    title: Joi.string().required(),
    description: Joi.string().required(),
    count: Joi.number().required(),
    price: Joi.number().required(),
})