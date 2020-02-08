import { ctxRequestBody } from './jest-helpers'
import * as Helper from '../src/middleware'
import Joi from '@hapi/joi'

describe('validateBody()', () => {
  const next = jest.fn(async () => {})
  const schema = Joi.object({
    foo: Joi.string().valid('bar').required()
  }).required()

  test('Valid data passes and next() gets called', async () => {
    const validator = Helper.validateBody(schema)
    const ctx = ctxRequestBody({ foo: 'bar' })
    const res = await validator(ctx, next)
    expect(ctx.status).toBe(undefined)
    expect(ctx.body).toBe(undefined)
    expect(next).toHaveBeenCalled()
  })

  test('Invalid data fails and short-circuits', async () => {
    const validator = Helper.validateBody(schema)
    const ctx = ctxRequestBody()
    const res = await validator(ctx, next)
    expect(ctx.status).toBe(400)
    expect(ctx.body.error).toBe('ValidationError')
    expect(next).not.toHaveBeenCalled()
  })

  test('Non-validation errors still throw', async () => {
    schema.validateAsync = async () => { throw new Error() }
    const validator = Helper.validateBody(schema)
    const ctx = ctxRequestBody()
    expect(validator(ctx, next)).rejects.toThrowError()
  })
})

describe('fetchExternals()', () => {
  const next = jest.fn(async () => {})

  test('Failed lookups return ValidationError', async () => {
    const lookup = async (values) => {
      const known = ['foo', 'bar']
      return values.map(value => known.includes(value) ? 'TRUE' : undefined)
    }
    const mapping = {
      foo: lookup
    }
    const ctx = ctxRequestBody({
      foo: ['foo', 'baz']
    })
    await Helper.fetchExternals(mapping)(ctx, next)
    expect(ctx.status).toBe(400)
    expect(ctx.body.error).toBe('ValidationError')
    expect(next).not.toHaveBeenCalled()
  })

  test('Successful lookups inflate request body', async () => {
    const lookup = async (values) => {
      const known = ['bar', 'baz']
      return values.map(value => known.includes(value) ? { qux: 'quux' } : undefined)
    }
    const mapping = {
      foo: lookup
    }
    const ctx = ctxRequestBody({ foo: ['bar', 'baz'] })
    await Helper.fetchExternals(mapping)(ctx, next)
    expect(ctx.status).toBe(undefined)
    expect(ctx.body).toBe(undefined)
    expect(ctx.request.body).not.toBe({ foo: ['bar', 'baz'] })
    expect(next).toHaveBeenCalled()
  })

  test('Lookup errors result in failed validation', async () => {
    const lookup = async (values) => {
      throw new Error()
    }
    const mapping = {
      foo: lookup
    }
    const ctx = ctxRequestBody({ foo: ['bar', 'baz'] })
    await Helper.fetchExternals(mapping)(ctx, next)
    expect(ctx.status).toBe(400)
    expect(ctx.body.error).toBe('ValidationError')
  })
})
