import { defineBackend } from '@aws-amplify/backend'
import { config } from '@dotenvx/dotenvx'
import { auth } from './auth/resource'
import { data } from './data/resource'
import { storage } from './storage/resource'
import { UserPool } from 'aws-cdk-lib/aws-cognito'
import { counter } from './functions/Counter/resource'
import { webhook } from './functions/webhook/resource'
import { webhookProcessor } from './functions/webhookProcessor/resource'
import { twilioInbound } from './functions/twilioInbound/resource'
import { PolicyStatement } from 'aws-cdk-lib/aws-iam'
import { HttpIamAuthorizer } from 'aws-cdk-lib/aws-apigatewayv2-authorizers'
import { HttpLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations'
import { CorsHttpMethod, HttpApi, HttpMethod, PayloadFormatVersion } from 'aws-cdk-lib/aws-apigatewayv2'
import { Stack } from 'aws-cdk-lib'
import { SquareWebhookStack } from './custom/webhookqueue/resource'
import { squareAuth } from './functions/getSquareAuth/resource'
import branchName from 'current-git-branch'

config({ path: '.env.local', override: false })

const APP_ID = process.env.AWS_APP_ID //the amplify App id

const backend = defineBackend({
  auth,
  data,
  storage,
  counter,
  webhook,
  webhookProcessor,
  twilioInbound,
  squareAuth,
})
const environment = process.env.ENVIRONMENT ?? 'dev'
const ordersTable = backend.data.resources.tables['Order']

backend.stack.tags.tagValues()

const squareWebhook = new SquareWebhookStack(backend.data.stack, 'SquareWebHookStack', {
  squareProcessorLambda: backend.webhookProcessor.resources.lambda,
  ordersTable: ordersTable,
  environment,
  appId: APP_ID!,
})

const apiStack = Stack.of(backend.webhook.resources.lambda.stack)

const httpApi = new HttpApi(apiStack, 'SquareWebhookApi', {
  apiName: 'square-webhook-api',
  corsPreflight: {
    allowMethods: [CorsHttpMethod.POST, CorsHttpMethod.OPTIONS],
    allowOrigins: ['*'],
    allowHeaders: ['*'],
  },
  createDefaultStage: true,
})

const webhookIntegration = new HttpLambdaIntegration('SquareWebhookIntegration', backend.webhook.resources.lambda)
const twilioIntegration = new HttpLambdaIntegration('TwilioIntegration', backend.twilioInbound.resources.lambda, {
  payloadFormatVersion: PayloadFormatVersion.VERSION_1_0,
})

const iamAuthorizer = new HttpIamAuthorizer()

httpApi.addRoutes({
  path: '/square-webhook',
  methods: [HttpMethod.POST, HttpMethod.OPTIONS],
  integration: webhookIntegration,
})

httpApi.addRoutes({
  path: '/twilio-inbound',
  methods: [HttpMethod.POST, HttpMethod.OPTIONS],
  integration: twilioIntegration,
})

// Output API info
backend.addOutput({
  custom: {
    SquareWebhookAPI: {
      endpoint: httpApi.url,
      region: Stack.of(httpApi).region,
    },
  },
})

const counterTable = backend.data.resources.tables['TicketCounter']
const userPool = backend.auth.resources.userPool as UserPool

backend.counter.addEnvironment('COUNTER_TABLE', counterTable.tableName)
backend.webhook.addEnvironment('WEBHOOK_URL', `${httpApi.url!}square-webhook`)
backend.webhook.addEnvironment('SQUARE_TOPIC_ARN', squareWebhook.squareTopic.topicArn)
backend.webhookProcessor.addEnvironment('SQS_QUEUE_URL', squareWebhook.squareQueue.queueUrl)
backend.webhookProcessor.addEnvironment('SQS_DLQ_URL', squareWebhook.squareDLQURL.queueUrl)
backend.webhookProcessor.addEnvironment('ORDERS_TABLE', ordersTable.tableName)
backend.webhookProcessor.addEnvironment('IDEMPOTENCY_TABLE', squareWebhook.idempotencyTable.tableName)

squareWebhook.squareTopic.grantPublish(backend.webhook.resources.lambda)

userPool.addGroup('Admin', {
  precedence: 0,
  description: 'Admin group',
  groupName: 'admin',
})

backend.counter.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    actions: ['dynamodb:UpdateItem', 'dynamodb:GetItem'],
    resources: [counterTable.tableArn],
  })
)

backend.data.resources.cfnResources.cfnGraphqlApi.name = 'italiafire'
