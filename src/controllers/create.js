import Koa from 'koa'
import Joi from '@hapi/joi'
import { wrapper } from '../helpers'
import Anime from '../models/anime'

/**
 * Initialise Koa
 */
const app = new Koa()

/**
 * Request validation
 * 
 * TODO: confirm remote IDs, normalise
 *
 * @constant {Joi.Schema} validation
 */
const validation = Joi.object({
  title: Joi.string().min(3).max(255).required().trim(),
  synopsis: Joi.string().max(1024).trim(),
  type: Joi.string().valid('series', 'movie').required(),
  episodes: Joi.number().when('type', { is: 'series', then: Joi.required() }),
  status: Joi.string().valid('planned', 'airing', 'completed').required(),
  aired: Joi.date(), // TODO: started/ended for series, normal broadcasting time
  premiered: Joi.date(), // TODO: regional
  producers: Joi.array().items(Joi.string().uuid()),
  licensors: Joi.array().items(Joi.string().uuid()), // TODO: regional
  studios: Joi.array().items(Joi.string().uuid()),
  source: Joi.object({
    type: Joi.string().valid('original', 'manga', 'light-novel').required(), // TODO: confirm possibilities
    id: Joi.string().uuid().when('type', { not: 'original', then: Joi.required() })
  }).required(),
  genres: Joi.array(Joi.string().uuid()),
  duration: Joi.number().min(1).max(300).required(),
  rating: Joi.string().valid('PG', '12', '15', '18').required() // TODO: regional
}).required()

/**
 * Function logic
 *
 * @param {Koa.Context} ctx
 */
const handler = async (ctx) => {
  //
}

/**
 * Wrap Koa in Lambda-compatible IO and export
 */
app.use(handler)
export default wrapper(app)
