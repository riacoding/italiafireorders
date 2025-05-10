import { DynamoDBClient, UpdateItemCommand } from '@aws-sdk/client-dynamodb'
import { unmarshall } from '@aws-sdk/util-dynamodb'

const client = new DynamoDBClient({})

export const handler = async () => {
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, '') // "20240501"
  const counterKey = `order-${today}`
  const tableName = process.env.COUNTER_TABLE

  console.log('env', process.env)

  const command = new UpdateItemCommand({
    TableName: tableName,
    Key: { id: { S: counterKey } },
    UpdateExpression: 'ADD #v :inc SET expiresAt = if_not_exists(expiresAt, :ttl)',
    ExpressionAttributeNames: { '#v': 'value' },
    ExpressionAttributeValues: {
      ':inc': { N: '1' },
      ':ttl': { N: (Math.floor(Date.now() / 1000) + 86400).toString() },
    },
    ReturnValues: 'UPDATED_NEW',
  })

  const result = await client.send(command)
  const value = unmarshall(result.Attributes!)?.value

  return {
    ticketNumber: `${today}-${value.toString().padStart(3, '0')}`,
  }
}
