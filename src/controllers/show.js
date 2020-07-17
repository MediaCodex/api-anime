import Koa from 'koa'
import { wrapper } from '../helpers'
import { pathParams } from '../middleware'
import Anime from '../models/anime'

/**
 * Initialise Koa
 */
const app = new Koa()
app.use(pathParams('/:id'))

/**
 * Function logic
 *
 * @param {Koa.Context} ctx
 */
const handler = async (ctx) => {
  const id = ctx.request.path
  ctx.body = await Anime.get(id)
  ctx.status = 200
}

/**
 * Wrap Koa in Lambda-compatible IO and export
 */
app.use(handler)
export default wrapper(app)
