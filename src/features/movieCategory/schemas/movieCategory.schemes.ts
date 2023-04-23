import Joi, { ObjectSchema } from 'joi';

const movieCategorySchema: ObjectSchema = Joi.object().keys({
    name: Joi.string().required().messages({
        'string.empty': 'Name property is not allowed to be empty'
      }),
    code: Joi.string().required().messages({
        'string.empty': 'Name property is not allowed to be empty'
      }),
    description: Joi.string().required().messages({
        'string.empty': 'Name property is not allowed to be empty'
      }),
    createUserId:  Joi.string().optional().allow(null, ''),
    updateUserId: Joi.string().optional().allow(null, ''),
    createdAt: { type: Date, default: Date.now() },
    updateAt: { type: Date, default: Date.now() }
});

export { movieCategorySchema };
