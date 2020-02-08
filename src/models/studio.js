import dynamoose from 'dynamoose'

/**
 * Attribute definitions
 *
 * NOTE: validation not included since all fields are assumed
 * to have been validated at the controller level.
 *
 * @constant {object} schemaAttributes
 */
const schemaAttributes = {
  id: {
    type: String,
    hashKey: true,
    required: true
  }
}

/**
 * Table name, also used for the global instance of the model
 *
 * @constant {string} modelName
 */
const modelName = process.env.DYNAMODB_TABLE_STUDIOS || 'studios'

/**
 * Model config, primarily this is to prevent Dynamoose from
 * trying to do anything with regards to managing the table
 * on AWS, since that is all provisioned using terraform.
 *
 * @constant {dynamoose.ModelOption} modelOptions
 */
const modelOptions = {
  create: false,
  update: false,
  waitForActive: false
}

/**
 * Schema config
 *
 * @see {@link (https://dynamoosejs.com/api/schema/#options)}
 *
 * @constant {object} schemaOptions
 */
const schemaOptions = {
  saveUnknown: true // NOTE: assumed to have been handled by controller validation
}

/**
 * Inflate IDs into details for denormalisation
 *
 * @param {(string|Array<string>)} id single, or array of UUIDs
 */
const inflateById = async function (ids) {
  if (!Array.isArray(ids)) ids = [ids]
  const items = await this.batchGet(ids)
  return ids.map(id => {
    const item = items.find(item => item.id === id)
    if (!item) return undefined
    return {
      // TODO: filter keys to keep
    }
  })
}

/**
 * Dynamoose model
 */
const schema = new dynamoose.Schema(schemaAttributes, schemaOptions)
schema.statics = { inflateById }
export default dynamoose.model(modelName, schema, modelOptions)
