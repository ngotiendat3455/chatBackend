import Joi, { ObjectSchema } from 'joi';

const movieSchema: ObjectSchema = Joi.object().keys({
    movieName: Joi.string().required().messages({
        'any.required': 'MovieName is a required field',
        'string.empty': 'MovieName property is not allowed to be empty'
      }),
    movieDescription: Joi.string().optional().allow(null, ''),
    movieTrailer: Joi.string().optional().allow(null, ''),
    movieCens: Joi.string().optional().allow(null, ''),
    movieRelease: Joi.string().optional().allow(null, ''),
    movieLenght: Joi.string().optional().allow(null, ''),
    movieFormat: Joi.string().optional().allow(null, ''),
    moviePoster: Joi.string().optional().allow(null, ''),
    movieType: Joi.number().required().messages({
        'any.required': 'movieType is a required field',
        'number.empty': 'movieType property is not allowed to be empty'
      }),
});


export { movieSchema };
