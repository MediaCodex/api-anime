export const dynamoMock = {
  query: jest.fn((params, callback) => callback(null, 'success')),
  getItem: jest.fn((params, callback) => callback(null, 'success')),
  putItem: jest.fn((params, callback) => callback(null, { Item: params.Item })),
  updateItem: jest.fn((params, callback) => callback(null, 'success'))
}

export const awsConfigMock = {
  accessKeyId: 'AKID',
  secretAccessKey: 'secret',
  region: 'local-env'
}
