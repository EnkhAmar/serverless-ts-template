import middy from '@middy/core';
import middyJsonBodyParser from '@middy/http-json-body-parser';
import { APIGatewayProxyResultV2 } from 'aws-lambda';
import { z } from 'zod'
import { ValidatedAPIGatewayProxyEvent } from './api-gateway';


type HandlerResponse = {
  data?: Record<string, unknown> | any;
  statusCode?: number;
  code?: string | number;
  msg?: string;
};

export function createHttpHandler<S>(handler: (event: ValidatedAPIGatewayProxyEvent<S>) => Promise<HandlerResponse>) {
  const wrapped = async (event: ValidatedAPIGatewayProxyEvent<S>): Promise<APIGatewayProxyResultV2> => {
    const headers = {
      'Access-Control-Allow-Headers': 'Content-Type,Authorization,x-api-key,Connection',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT,DELETE',
    };

    try {
      const result = await handler(event);
      return {
        statusCode: result.statusCode || 200,
        headers,
        body: JSON.stringify({
          code: result.code || 0,
          msg: result.msg || 'success',
          data: result.data || {},
        }),
      };
    } catch (error: any) {
      let statusCode = 500;
      let code = error.code || 5;
      let message = error.message;
      let data = error.data ?? null;
      console.error('Error ', error);
      if (error instanceof z.ZodError) {
        statusCode = 400;
        code = 4;
        message = 'One or more parameter is invalid or missing!';
        data = z.flattenError(error);
      }
      return {
        statusCode: statusCode,
        headers,
        body: JSON.stringify({
          code: statusCode,
          msg: error.message,
          data: data,
        }),
      };
    }
  };

  // apply middy middlewares
  return middy(wrapped).use(middyJsonBodyParser());
}
