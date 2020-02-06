import serverless from 'serverless-http'

/**
 * Either return an AWS Lambda handler or init
 * a local instance, depending on NODE_ENV
 *
 * @param {import('koa').Koa} app Koa application
 */
export const wrapper = (app) => {
  const environment = process.env.NODE_ENV || 'local'

  if (environment !== 'local') {
    // wrap koa for lambda
    return async (event, context) => {
      return serverless(app)(event, context)
    }
  }

  app.listen(3000)
  console.info('listening at http://127.0.0.1:3000')
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
    validated = await schema.validateAsync(ctx.body, { abortEarly: false, stripUnknown: true, ...options })
  } catch (error) {
    if (error.name !== 'ValidationError') throw error
    const removeValues = (field) => { delete field.context.value; return field }
    validated.details.map(removeValues)
    ctx.body = { error: 'ValidationError', fields: error.details }
    ctx.status = 400
    return
  }

  ctx.request.body = validated
  await next()
}
