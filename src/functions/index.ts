import { defineApiEvent } from '@/libs/handler-resolver';

export const test = defineApiEvent(__dirname, 'test', 'get', 'test', false, {});
