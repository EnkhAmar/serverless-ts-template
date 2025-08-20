import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { LambdaClient } from '@aws-sdk/client-lambda'
import { S3Client } from '@aws-sdk/client-s3';

const AWS_REGION = process.env.AMAZON_REGION
export const dynamoDb = DynamoDBDocumentClient.from(new DynamoDBClient({ region: AWS_REGION }));
export const lambdaClient = new LambdaClient({ region: AWS_REGION });
export const s3Client = new S3Client({ region: process.env.AMAZON_REGION })