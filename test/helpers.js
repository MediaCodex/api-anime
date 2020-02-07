import * as Helper from '../src/helpers'
import Joi from '@hapi/joi'

describe('validateBody()', () => {
  const next = jest.fn(async () => {})
  const schema = Joi.object({
    foo: Joi.string().valid('bar').required()
  }).required()

  test('Valid data passes and next() gets called', async () => {
    const validator = Helper.validateBody(schema)
    const ctx = {
      request: {
        body: { foo: 'bar' }
      }
    }
    const res = await validator(ctx, next)
    expect(ctx.status).toBe(undefined)
    expect(ctx.body).toBe(undefined)
    expect(next).toHaveBeenCalled()
  })

  test('Invalid data fails and short-circuits', async () => {
    const validator = Helper.validateBody(schema)
    const ctx = { request: { body: {} } }
    const res = await validator(ctx, next)
    expect(ctx.status).toBe(400)
    expect(ctx.body.error).toBe('ValidationError')
    expect(next).not.toHaveBeenCalled()
  })

  test('Non-validation errors still throw', async () => {
    schema.validateAsync = async () => { throw new Error() }
    const validator = Helper.validateBody(schema)
    const ctx = { request: { body: {} } }
    expect(validator(ctx, next)).rejects.toThrowError()
  })
})
