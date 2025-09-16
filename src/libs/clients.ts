import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { LambdaClient } from '@aws-sdk/client-lambda';
import { S3Client } from '@aws-sdk/client-s3';
import { fromIni } from '@aws-sdk/credential-provider-ini';
import { IS_OFFLINE } from './config';

const AWS_REGION = process.env.AMAZON_REGION;
const offlineCredentials = IS_OFFLINE ? { credentials: fromIni({ profile: process.env.AWS_PROFILE_NAME }) } : {};
export const dynamoClient = DynamoDBDocumentClient.from(
  new DynamoDBClient({ region: AWS_REGION, ...offlineCredentials })
);
export const lambdaClient = new LambdaClient({ region: AWS_REGION, ...offlineCredentials });
export const s3Client = new S3Client({ region: AWS_REGION, ...offlineCredentials });