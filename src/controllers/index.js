import Koa from 'koa'
import { wrapper } from '../helpers'
import Anime from '../models/anime'

/**
 * Initialise Koa
 */
const app = new Koa()

/**
 * Function logic
 *
 * @param {Koa.Context} ctx
 */
const handler = async (ctx) => {
  const perPage = 10 // TODO: add proper pagination based on HTTP headers
  ctx.body = await Anime.query().limit(perPage).exec()
  ctx.status = 200
}

/**
 * Wrap Koa in Lambda-compatible IO and export
 */
app.use(handler)
export default wrapper(app)
