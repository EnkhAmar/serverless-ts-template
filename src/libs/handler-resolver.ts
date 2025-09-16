export const handlerPath = (context: string) => {
  return `${context.split(process.cwd())[1].substring(1).replace(/\\/g, '/')}`;
};

type HttpMethod = 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options';
export const defineApiEvent = (
  context: string,
  fnName: string,
  method: HttpMethod,
  path: string,
  authenticated = false,
  // caching = false,
  config = {}
) => {
  let httpEvent: any = {
    method: method,
    path: path,
    cors: true,
    ...config,
  };
  if (authenticated) {
    httpEvent['authorizer'] = {
      type: 'COGNITO_USER_POOLS',
      authorizerId: {
        Ref: 'CognitoAuthorizer',
      },
    };
  }
  return {
    handler: `${handlerPath(context)}/handler.${fnName}`,
    events: [
      {
        http: httpEvent,
      },
    ],
  };
};
