import { SQSHandler } from 'aws-lambda'

export const handler: SQSHandler = async (event) => {
  console.log('🟥 DLQ Event Received:', JSON.stringify(event, null, 2))

  for (const record of event.Records) {
    try {
      const body = JSON.parse(record.body)
      console.log('🧾 DLQ Record Body:', body)
      // TODO: alerting / inspection logic can go here
    } catch (err) {
      console.error('❌ Error parsing DLQ record:', err)
    }
  }
}
