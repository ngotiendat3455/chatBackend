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
  movieCategoryId: Joi.string().required().messages({
    'any.required': 'movieCategoryId is a required field',
    'string.empty': 'movieCategoryId property is not allowed to be empty'
  }),
  movieGenres:Joi.string().optional().allow(null, ''),
  movieCategoryName: Joi.string().optional().allow(null, ''),
  createdAt: { type: Date, default: Date.now() },
  updateAt: { type: Date, default: Date.now() },
  createUserId:  Joi.string().optional().allow(null, ''),
  updateUserId: Joi.string().optional().allow(null, ''),
});

export { movieSchema };
