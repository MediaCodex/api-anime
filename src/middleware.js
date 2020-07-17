import Joi from '@hapi/joi'
import { Path } from 'path-parser'

/**
 * Parse the Path paramters from path or eventContext
 *
 * @param {string} path
 * @returns {import('koa').Middleware}
 */
export const pathParams = path => async (ctx) => {
  const environment = process.env.NODE_ENV || 'local'

  if (environment !== 'local') {
    ctx.request.pathParams = ctx.request.requestContext.pathParameters
  }

  if (environment === 'local') {
    const parser = new Path(path)
    ctx.request.pathParams = parser.test(ctx.request.path)
  }
}

/**
 * Validate request body, or return validation-failed response
 *
 * @param {import('@hapi/joi').Schema} schema
 * @param {import('@hapi/joi').ValidationOptions} options
 * @returns {import('koa').Middleware}
 */
export const validateBody = (schema, options) => async function validator (ctx, next) {
  let validated; try {
    validated = await schema.validateAsync(ctx.request.body, { abortEarly: false, stripUnknown: true, ...options })
  } catch (error) {
    if (error.name !== 'ValidationError') throw error
    const removeValues = (field) => { delete field.context.value; return field }
    error.details.map(removeValues)
    ctx.body = { error: 'ValidationError', fields: error.details }
    ctx.status = 400
    return
  }

  ctx.request.body = validated
  await next()
}

/**
 * Inflate request params by fetching from external source
 *
 * @param {Object} mapping map of key to functions
 * @returns {import('koa').Middleware}
 */
export const fetchExternals = (mapping) => async function fetchExternals (ctx, next) {
  const lookups = []
  for (const key of Object.keys(mapping)) {
    const param = ctx.request.body[key]
    if (!param) continue
    // eslint-disable-next-line no-async-promise-executor
    lookups.push(new Promise(async resolve => {
      try {
        ctx.request.body[key] = await mapping[key](param)
      } catch (error) {
        ctx.request.body[key] = param.map(item => undefined)
      }
      resolve()
    }))
  }
  await Promise.all(lookups)

  const schema = {}
  for (const key of Object.keys(mapping)) {
    const param = ctx.request.body[key]
    if (Array.isArray(param)) {
      schema[key] = Joi.array().items(Joi.object().required()).required()
    } else {
      schema[key] = Joi.object().required()
    }
  }
  const validator = validateBody(Joi.object(schema).required())
  await validator(ctx, next)
  if (ctx.status === 400) return

  await next()
}
