import Anime from '../../src/models/anime'
import dynamoose from 'dynamoose'
import { dynamoMock, awsConfigMock } from '../jest-helpers'

beforeEach(() => {
  dynamoose.AWS.config.update(awsConfigMock)
  dynamoose.setDDB(dynamoMock)
})

afterEach(() => {
  dynamoose.revertDDB()
})

describe('schema', () => {
  test('fails with invalid schema', () => {
    expect(
      Anime.create({ id: 1337 })
    ).rejects.toThrow(/^Validation failed/)
  })

  test('allows correct schema', async () => {
    let errored = false
    try {
      await Anime.create({ id: '1337' })
    } catch (error) {
      errored = true
    }
    expect(errored).toBe(false)
  })
})
