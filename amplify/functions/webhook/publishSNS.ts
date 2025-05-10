import { SNSClient, PublishCommand } from '@aws-sdk/client-sns'

export const publish = async (message: unknown, subject: string) => {
  const topicArn = process.env.SQUARE_TOPIC_ARN
  if (!topicArn) throw new Error('SQUARE_TOPIC_ARN not set')
  try {
    const client = new SNSClient()
    console.log('publishing message', JSON.stringify(message))
    const input = {
      Message: JSON.stringify(message),
      Subject: subject,

      TopicArn: process.env.SQUARE_TOPIC_ARN,
    }
    const command = new PublishCommand(input)
    await client.send(command)

    return 'ok'
  } catch (err) {
    console.error('❌ Failed to publish SNS message:', err)
    throw err
  }
}
