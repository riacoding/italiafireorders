import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'
import * as sns from 'aws-cdk-lib/aws-sns'
import * as sqs from 'aws-cdk-lib/aws-sqs'
import * as snsSubscriptions from 'aws-cdk-lib/aws-sns-subscriptions'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'
import * as lambdaEventSources from 'aws-cdk-lib/aws-lambda-event-sources'
import * as iam from 'aws-cdk-lib/aws-iam'
import { AttributeType, BillingMode, ITable, Table } from 'aws-cdk-lib/aws-dynamodb'
import url from 'url'
import { IFunction } from 'aws-cdk-lib/aws-lambda'
import { Function as LambdaFunction } from 'aws-cdk-lib/aws-lambda'
import { defineFunction } from '@aws-amplify/backend'

export type WebhookStackProps = {
  squareProcessorLambda: IFunction // Lambda B: SquareWebhookProcessor
  ordersTable: ITable
  environment: string
  appId: string
}

export class SquareWebhookStack extends Construct {
  public readonly squareTopic: sns.Topic
  public readonly squareQueue: sqs.Queue
  public readonly squareDLQURL: sqs.Queue
  public readonly squareProcessorLambda: IFunction
  public readonly ordersTable: ITable
  public readonly idempotencyTable: ITable

  constructor(scope: Construct, id: string, props: WebhookStackProps) {
    super(scope, id)
    const { squareProcessorLambda, ordersTable, environment, appId } = props

    this.ordersTable = ordersTable
    this.squareProcessorLambda = squareProcessorLambda

    this.idempotencyTable = new Table(this, 'SquareEventLog', {
      tableName: `SquareEventLog-${appId}-${environment}`,
      partitionKey: { name: 'event_id', type: AttributeType.STRING },
      billingMode: BillingMode.PAY_PER_REQUEST,
      timeToLiveAttribute: 'ttl',
    })

    this.idempotencyTable.grantReadWriteData(squareProcessorLambda)

    squareProcessorLambda.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ['dynamodb:GetItem', 'dynamodb:PutItem'],
        resources: [this.idempotencyTable.tableArn],
      })
    )

    //  Create SNS Topic
    this.squareTopic = new sns.Topic(this, `SquareWebhookTopic`, {
      topicName: `SquareWebhookTopic-${appId}-${environment}`,
    })

    //  Create SQS Queue
    const squareQueue = new sqs.Queue(this, 'SquareWebhookQueue', {
      queueName: `SquareWebhookQueue-${appId}-${environment}`,
      retentionPeriod: cdk.Duration.days(4), // Retains messages for 4 days
      visibilityTimeout: cdk.Duration.seconds(30), // Matches Lambda timeout
    })

    this.squareQueue = squareQueue

    //  Create SQS DLQ
    const squareDLQ = new sqs.Queue(this, `${id}-SquareWebhookQueueDLQ`, {
      queueName: `SquareWebhookDLQ-${appId}-${environment}`,
      retentionPeriod: cdk.Duration.days(4), // Retains messages for 4 days
      visibilityTimeout: cdk.Duration.minutes(30), // Matches Lambda timeout
    })

    this.squareDLQURL = squareDLQ

    //  Subscribe SQS to SNS Topic
    this.squareTopic.addSubscription(new snsSubscriptions.SqsSubscription(squareQueue))

    //  Create Square Processor Lambda (Reads from SQS)
    // const squareProcessorLambda = new NodejsFunction(this, `${id}-SquareProcessorHandler`, {
    //   functionName: `${id}-SquareProcessorHandler`,
    //   runtime: lambda.Runtime.NODEJS_22_X,
    //   entry: url.fileURLToPath(new URL('./SquareProcessor/processor.ts', import.meta.url)),
    //   timeout: cdk.Duration.seconds(30),
    //   environment: {
    //     SQS_DLQ_URL: this.squareDLQURL.queueUrl,
    //     SQS_QUEUE_URL: squareQueue.queueUrl,
    //     ORDERS_TABLE: ordersTable.tableName,

    //   },
    // })

    // data.resources.graphqlApi.grantQuery(messageProcessorLambda)
    // data.resources.graphqlApi.grantMutation(messageProcessorLambda)

    //  Create Message DLQ Processor Lambda (Reads from SQS DLQ)
    const squareDLQProcessorLambda = new NodejsFunction(this, `${id}-SquareDLQHandler`, {
      functionName: `SquareDLQHandler-${appId}-${environment}`,
      runtime: lambda.Runtime.NODEJS_22_X,
      entry: url.fileURLToPath(new URL('./SquareDLQ/processor.ts', import.meta.url)),
      timeout: cdk.Duration.seconds(30),
      environment: {
        SQS_DLQ_URL: squareDLQ.queueUrl,
        ORDER_TABLE: ordersTable.tableName,
      },
    })

    //  Grant Necessary Permissions to Lambda
    squareQueue.grantConsumeMessages(squareProcessorLambda)

    squareProcessorLambda.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ['sqs:ReceiveMessage', 'sqs:DeleteMessage'],
        resources: [squareQueue.queueArn],
      })
    )

    squareProcessorLambda.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ['dynamodb:PutItem'],
        resources: [ordersTable.tableArn],
      })
    )

    //  Set SQS as an Event Source for Lambda
    squareProcessorLambda.addEventSource(
      new lambdaEventSources.SqsEventSource(squareQueue, {
        batchSize: 10, // Adjust as needed
      })
    )

    squareProcessorLambda.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ['sqs:sendMessage'],
        resources: [squareDLQ.queueArn],
      })
    )

    squareDLQProcessorLambda.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ['sqs:ReceiveMessage', 'sqs:DeleteMessage'],
        resources: [squareDLQ.queueArn],
      })
    )

    //  Set SQS as an Event Source for DLQLambda
    squareDLQProcessorLambda.addEventSource(
      new lambdaEventSources.SqsEventSource(squareDLQ, {
        batchSize: 10, // Adjust as needed
      })
    )

    // Output important resources for Amplify integration
    new cdk.CfnOutput(this, 'SquareSnsTopicArn', { value: this.squareTopic.topicArn })
    new cdk.CfnOutput(this, 'SquareQueueName', { value: squareQueue.queueName })
    new cdk.CfnOutput(this, 'SquareDLQUrl', { value: squareDLQ.queueUrl })
    new cdk.CfnOutput(this, 'SquareProcessorLambda', { value: squareProcessorLambda.functionName })
  }
}
