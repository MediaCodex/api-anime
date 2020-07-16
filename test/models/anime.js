import Anime from '../../src/models/anime'
import dynamoose from 'dynamoose'
import { dynamoMock, awsConfigMock } from '../jest-helpers'

beforeAll(() => {
  dynamoose.AWS.config.update(awsConfigMock)
  dynamoose.setDDB(dynamoMock)
})

afterAll(() => {
  dynamoose.revertDDB()
})

describe('schema', () => {
  test('fails with invalid schema', () => {
    expect(
      Anime.create({ id: 'INVALID_UUID' })
    ).rejects.toThrow(/^Validation failed/)
  })

  test('allows correct schema', async () => {
    let errored = false
    try {
      await Anime.create({ id: 'a'.repeat(36) })
    } catch (error) {
      errored = true
    }
    expect(errored).toBe(false)
  })
})
