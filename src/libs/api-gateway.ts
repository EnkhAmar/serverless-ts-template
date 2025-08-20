import type { APIGatewayProxyEvent, APIGatewayProxyResultV2, Handler } from 'aws-lambda';

export type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, 'body'> & { body: S };
export type ValidatedEventAPIGatewayProxyEvent<S> = Handler<ValidatedAPIGatewayProxyEvent<S>, APIGatewayProxyResultV2>;
type StatusCode = number;
type Code = number | string;

export const formatJSONResponse = (
  response: Record<string, unknown>,
  statusCode: StatusCode = 200,
  code: Code = 'SUC',
  msg: string = 'success'
) => {
  return {
    statusCode: statusCode,
    headers: {
      'Access-Control-Allow-Headers': 'Content-Type,Authorization,x-api-key,Connection',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT,DELETE',
    },
    body: JSON.stringify({
      code: code,
      msg: msg,
      ...response,
    }),
  };
};
