import { handlerPath } from '@/libs/handler-resolver';

export const test = {
  handler: `${handlerPath(__dirname)}/handler.test`,
  events: [
    {
      http: {
        method: 'get',
        path: 'test',
      },
    },
  ],
};
