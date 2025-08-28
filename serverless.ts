import { test } from '@/functions';
import type { AWS } from '@serverless/typescript';
import * as dotenv from 'dotenv';

dotenv.config();

const serverlessConfiguration: AWS = {
  service: 'service-name',
  frameworkVersion: '4',
  app: 'app-name',
  plugins: ['serverless-dotenv-plugin', 'serverless-prune-plugin', 'serverless-api-gateway-caching'],
  provider: {
    name: 'aws',
    stage: "${opt:stage, 'dev'}",
    runtime: 'nodejs22.x',
    region: process.env.AMAZON_REGION as "ap-northeast-2",
    profile: process.env.AWS_PROFILE_NAME ?? "default",
    logRetentionInDays: 365,
    iam: {
      "role": "arn:aws:iam::${self:provider.environment.AWS_ACCOUNT_ID}:role/" + process.env.AWS_SLS_ROLE,
    },
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      AWS_ACCOUNT_ID: process.env.AWS_ACCOUNT_ID ?? "",

      COGNITO_USER_POOL_ID: process.env.COGNITO_USER_POOL_ID ?? "",
      COGNITO_USER_CLIENT_ID: process.env.COGNITO_USER_CLIENT_ID ?? "",
    },
  },
  // import the function via paths
  functions: {
    test,
  },
  resources: {
    Resources: {
      CognitoUserAuthorizer: {
        Type: 'AWS::ApiGateway::Authorizer',
        Properties: {
          RestApiId: { Ref: 'ApiGatewayRestApi' },
          Type: 'COGNITO_USER_POOLS',
          IdentitySource: 'method.request.header.Authorization',
          AuthorizerResultTtlInSeconds: 300,
          Name: 'CognitoUserAuthorizer',
          ProviderARNs: ['arn:aws:cognito-idp:${self:provider.region}:${self:provider.environment.AWS_ACCOUNT_ID}:userpool/${self:provider.environment.COGNITO_USER_POOL_ID}'],
        }
      },
      GatewayResponseDefault4XX: {
        Type: 'AWS::ApiGateway::GatewayResponse',
        Properties: {
          ResponseParameters: {
            'gatewayresponse.header.Access-Control-Allow-Origin': "'*'",
            'gatewayresponse.header.Access-Control-Allow-Headers': "'Content-Type,Authorization,x-api-key,Connection'",
            'gatewayresponse.header.Access-Control-Allow-Methods': "'GET,OPTIONS,POST,PUT'",
          },
          ResponseType: 'DEFAULT_4XX',
          RestApiId: {
            Ref: 'ApiGatewayRestApi'
          }
        }
      },
    },
  },
  package: { individually: true },
  custom: {
    prune: {
      automatic: true,
      number: 2,
    },
    function_timeout: {
      prod: 30,
    },
    apiGatewayCaching: {
      enabled: true,
    },
  },
};

module.exports = serverlessConfiguration;
