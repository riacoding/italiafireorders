import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb'

const client = DynamoDBDocumentClient.from(new DynamoDBClient())
const IDEMPOTENCY_TABLE = process.env.IDEMPOTENCY_TABLE!

export function sanitizeBigInts(obj: any): any {
  if (typeof obj === 'bigint') return obj.toString()
  if (Array.isArray(obj)) return obj.map(sanitizeBigInts)
  if (obj !== null && typeof obj === 'object') {
    return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, sanitizeBigInts(v)]))
  }
  return obj
}

export async function isDuplicate(eventId: string): Promise<boolean> {
  const result = await client.send(
    new GetCommand({
      TableName: IDEMPOTENCY_TABLE,
      Key: { event_id: eventId },
    })
  )
  return !!result.Item
}

export async function markProcessed(eventId: string) {
  try {
    await client.send(
      new PutCommand({
        TableName: IDEMPOTENCY_TABLE,
        Item: {
          event_id: eventId,
          processed_at: Date.now(),
          ttl: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
        },
        ConditionExpression: 'attribute_not_exists(event_id)',
      })
    )
  } catch (err: any) {
    if (err.name === 'ConditionalCheckFailedException') {
      console.warn(`⚠️ Skipping duplicate: event_id ${eventId} already exists in ${IDEMPOTENCY_TABLE}`)
    } else {
      throw err // Let others bubble up
    }
  }
}
