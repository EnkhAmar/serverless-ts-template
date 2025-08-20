import { APIGatewayProxyResultV2 } from "aws-lambda"
import { ValidatedEventAPIGatewayProxyEvent, ValidatedAPIGatewayProxyEvent } from "./api-gateway"

type HandlerResponse = {
  data?: Record<string, unknown> | any
  statusCode?: number
  code?: string | number
  msg?: string
}

export function withResponseHandler<S>(
  handler: (event: ValidatedAPIGatewayProxyEvent<S>) => Promise<HandlerResponse>
): ValidatedEventAPIGatewayProxyEvent<S> {
  return async (event): Promise<APIGatewayProxyResultV2> => {
    try {
      const result = await handler(event)

      return {
        statusCode: result.statusCode ?? 200,
        headers: {
          'Access-Control-Allow-Headers': 'Content-Type,Authorization,x-api-key,Connection',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT,DELETE'
        },
        body: JSON.stringify({
          code: result.code ?? "SUC",
          msg: result.msg ?? "success",
          data: result.data ?? {}
        })
      }
    } catch (error: any) {
      console.error("Error ", error)
      return {
        statusCode: error.statusCode ?? 500,
        headers: {
          'Access-Control-Allow-Headers': 'Content-Type,Authorization,x-api-key,Connection',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT,DELETE'
        },
        body: JSON.stringify({
          code: error.code ?? "ERR",
          msg: error.message,
          data: error.data ?? null
        })
      }
    } finally {
      // event.headers['Authorization'] байвал явуулсан endpoint, метод-оор нь лог хийж хадгалах
      // user activity logs
    }
  }
}