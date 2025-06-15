import { defineBackend } from '@aws-amplify/backend'
import { auth } from './auth/resource'
import { data } from './data/resource'
import { storage } from './storage/resource'
import { config } from '@dotenvx/dotenvx'
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

const currentBranch = process.env.ENVIRONMENT === 'sandbox' ? 'sandbox' : branchName() || process.env.AWS_BRANCH

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

const APP_BASE_URL =
  currentBranch === 'prepeat-dev'
    ? 'https://prepeat-dev.dgs4gp483bprx.amplifyapp.com'
    : currentBranch === 'main'
      ? 'https://main.dgs4gp483bprx.amplifyapp.com/'
      : 'http://localhost:3000'

const squareWebhook = new SquareWebhookStack(backend.data.stack, 'SquareWebHookStack', {
  squareProcessorLambda: backend.webhookProcessor.resources.lambda,
  ordersTable: ordersTable,
  environment,
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
    deployment: process.env.AWS_DEPLOYMENT_TYPE,
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
backend.squareAuth.addEnvironment('APP_BASE_URL', APP_BASE_URL)

squareWebhook.squareTopic.grantPublish(backend.webhook.resources.lambda)

backend.counter.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    actions: ['dynamodb:UpdateItem', 'dynamodb:GetItem'],
    resources: [counterTable.tableArn],
  })
)

backend.data.resources.cfnResources.cfnGraphqlApi.name = 'PizzaMenu'
